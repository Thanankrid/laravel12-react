<?php

namespace App\Http\Controllers\Api\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceInvoice;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    // รายการใบแจ้งหนี้ทั้งหมด
    public function index()
    {
        $invoices = MaintenanceInvoice::with([
            'request.requester',
            'request.technician',
            'items'
        ])
            ->latest()
            ->get();

        return response()->json($invoices);
    }

    // สร้างใบแจ้งหนี้จากงานซ่อม
    public function store(Request $request)
    {
        $validated = $request->validate([
            'maintenance_request_id' =>
                'required|exists:maintenance_requests,id',
            'note' =>
                'nullable|string|max:1000',
        ]);

        $maintenanceRequest = MaintenanceRequest::with(
            'repairLogs'
        )->findOrFail(
            $validated['maintenance_request_id']
        );

        // ออกใบแจ้งหนี้ได้เมื่อผู้แจ้งยืนยันว่างานเสร็จแล้วเท่านั้น
        abort_unless(
            $maintenanceRequest->status === 'completed',
            409,
            'ต้องให้ผู้แจ้งยืนยันว่างานเสร็จก่อนจึงออกใบแจ้งหนี้ได้'
        );

        // ป้องกันสร้าง Invoice ซ้ำ
        $existingInvoice = MaintenanceInvoice::where(
            'maintenance_request_id',
            $maintenanceRequest->id
        )->first();

        if ($existingInvoice) {
            return response()->json([
                'message' =>
                    'รายการแจ้งซ่อมนี้มีใบแจ้งหนี้แล้ว',
                'data' => $existingInvoice,
            ], 422);
        }

        return DB::transaction(function () use (
            $maintenanceRequest,
            $validated
        ) {

            // รวมค่าแรงทั้งหมดจาก Repair Log
            $laborCost = $maintenanceRequest
                ->repairLogs
                ->sum('labor_cost');

            // รวมค่าอะไหล่ทั้งหมดจาก Repair Log
            $partsCost = $maintenanceRequest
                ->repairLogs
                ->sum('parts_cost');

            $totalAmount =
                $laborCost + $partsCost;

            // สร้าง Invoice ก่อนเพื่อเอา ID
            $invoice = MaintenanceInvoice::create([
                'invoice_no' =>
                    'TEMP-' . uniqid(),

                'maintenance_request_id' =>
                    $maintenanceRequest->id,

                'labor_cost' =>
                    $laborCost,

                'parts_cost' =>
                    $partsCost,

                'total_amount' =>
                    $totalAmount,

                'payment_status' =>
                    'unpaid',

                'note' =>
                    $validated['note'] ?? null,

                'issued_at' =>
                    now()->toDateString(),
            ]);

            // สร้างเลข Invoice
            $invoice->update([
                'invoice_no' =>
                    'INV-' .
                    now()->format('Y') .
                    '-' .
                    str_pad(
                        $invoice->id,
                        4,
                        '0',
                        STR_PAD_LEFT
                    ),
            ]);

            // รายการค่าแรง
            if ($laborCost > 0) {
                $invoice->items()->create([
                    'description' =>
                        'ค่าบริการและค่าแรงช่าง',

                    'quantity' => 1,

                    'unit_price' =>
                        $laborCost,

                    'subtotal' =>
                        $laborCost,
                ]);
            }

            // รายการค่าอะไหล่
            if ($partsCost > 0) {
                $invoice->items()->create([
                    'description' =>
                        'ค่าอะไหล่และอุปกรณ์',

                    'quantity' => 1,

                    'unit_price' =>
                        $partsCost,

                    'subtotal' =>
                        $partsCost,
                ]);
            }

            $invoice->load([
                'request.requester',
                'request.technician',
                'items'
            ]);

            return response()->json([
                'message' =>
                    'สร้างใบแจ้งหนี้สำเร็จ',

                'data' =>
                    $invoice,
            ], 201);
        });
    }

    // ดูใบแจ้งหนี้
    public function show(
        Request $request,
        MaintenanceInvoice $invoice
    ) {
        $invoice->load([
            'request.requester',
            'request.technician',
            'request.repairLogs',
            'items'
        ]);

        // ช่างและ Admin ดูได้ทุกใบ ผู้แจ้งดูได้เฉพาะใบแจ้งหนี้ของงานตัวเอง
        abort_unless(
            in_array($request->user()->role, ['admin', 'technician'], true) || $invoice->request->user_id === $request->user()->id,
            403,
            'ไม่มีสิทธิ์ดูใบแจ้งหนี้นี้'
        );

        return response()->json(
            $invoice
        );
    }

    // อัปเดตสถานะการชำระเงิน
    public function update(
        Request $request,
        MaintenanceInvoice $invoice
    ) {
        $validated = $request->validate([
            // สถานะ "ชำระแล้ว" เกิดจากการชำระเงินผ่านระบบเท่านั้น Admin ทำได้เพียงยกเลิก
            'payment_status' =>
                'sometimes|required|in:cancelled',

            'note' =>
                'nullable|string|max:1000',
        ]);

        // ใบที่ชำระแล้วเป็นหลักฐานการรับเงิน จึงแก้ไขไม่ได้
        abort_if(
            $invoice->payment_status === 'paid',
            409,
            'ใบแจ้งหนี้ที่ชำระแล้วไม่สามารถแก้ไขได้'
        );

        $invoice->update(
            $validated
        );

        return response()->json([
            'message' =>
                'อัปเดตใบแจ้งหนี้สำเร็จ',

            'data' =>
                $invoice->fresh(),
        ]);
    }

    // ชำระเงินแบบจำลอง: ไม่มีการตัดเงินจริง และไม่รับเลขบัตรเต็ม
    // หน้าเว็บส่งมาเพียง token ของบัตรทดสอบ เช่น tok_visa_4242
    public function pay(
        Request $request,
        MaintenanceInvoice $invoice
    ) {
        $validated = $request->validate([
            'method' => 'required|in:promptpay,card',
            'token' => ['nullable', 'required_if:method,card', 'regex:/^tok_(visa|mastercard|jcb)_\d{4}$/'],
        ]);

        return DB::transaction(function () use ($request, $invoice, $validated) {
            // ล็อกแถวไว้ กันการกดชำระซ้ำพร้อมกัน
            $invoice = MaintenanceInvoice::with('request')
                ->lockForUpdate()
                ->findOrFail($invoice->id);

            abort_unless(
                $request->user()->role === 'admin' || $invoice->request->user_id === $request->user()->id,
                403,
                'ชำระได้เฉพาะผู้แจ้งงานนี้หรือผู้ดูแลระบบ'
            );

            abort_if($invoice->payment_status !== 'unpaid', 409, 'ใบแจ้งหนี้นี้ไม่อยู่ในสถานะรอชำระ');

            abort_if((float) $invoice->total_amount <= 0, 422, 'ใบแจ้งหนี้นี้ไม่มียอดที่ต้องชำระ');

            // บัตรทดสอบที่ลงท้ายด้วย 0002 จำลองกรณีธนาคารปฏิเสธ
            abort_if(
                $validated['method'] === 'card' && str_ends_with($validated['token'], '_0002'),
                402,
                'บัตรถูกปฏิเสธ (บัตรทดสอบ) กรุณาใช้บัตรอื่น'
            );

            $invoice->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'payment_method' => $validated['method'],
                'payment_ref' => 'SIM-' . now()->format('ymd') . '-' . Str::upper(Str::random(8)),
            ]);

            return response()->json(
                $invoice->fresh()->load(['request.requester', 'request.technician', 'items'])
            );
        });
    }

    // ลบใบแจ้งหนี้
    public function destroy(
        MaintenanceInvoice $invoice
    ) {
        $invoice->delete();

        return response()->json([
            'message' =>
                'ลบใบแจ้งหนี้สำเร็จ',
        ]);
    }
}