<?php

namespace App\Http\Controllers\Api\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceInvoice;
use App\Models\MaintenanceRepairLog;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RepairLogController extends Controller
{
    public function index(Request $request)
    {
        $query = MaintenanceRepairLog::with([
            'technician:id,name,email',
            'maintenanceRequest:id,request_no,title,status'
        ]);

        if ($request->filled('maintenance_request_id')) {
            $query->where(
                'maintenance_request_id',
                $request->maintenance_request_id
            );
        }

        return response()->json(
            $query->latest()->get()
        );
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'maintenance_request_id' =>
                'required|exists:maintenance_requests,id',

            'action' =>
                'required|string|max:255',

            'repair_detail' =>
                'nullable|string',

            'labor_cost' =>
                'nullable|numeric|min:0',

            'parts_cost' =>
                'nullable|numeric|min:0',

            'status' =>
                'nullable|in:assigned,in_progress,waiting_parts,completed',
        ]);

        return DB::transaction(function () use (
            $request,
            $validated
        ) {
            $maintenanceRequest =
                MaintenanceRequest::findOrFail(
                    $validated['maintenance_request_id']
                );

            $log = MaintenanceRepairLog::create([
                'maintenance_request_id' =>
                    $maintenanceRequest->id,

                'technician_id' =>
                    $maintenanceRequest->technician_id
                        ?? $request->user()->id,

                'action' =>
                    $validated['action'],

                'repair_detail' =>
                    $validated['repair_detail'] ?? null,

                'labor_cost' =>
                    $validated['labor_cost'] ?? 0,

                'parts_cost' =>
                    $validated['parts_cost'] ?? 0,

                'completed_at' =>
                    ($validated['status'] ?? null) === 'completed'
                        ? now()
                        : null,
            ]);


            if (!empty($validated['status'])) {
                $updateData = [
                    'status' => $validated['status'],
                ];

                if (
                    $validated['status'] === 'in_progress' &&
                    !$maintenanceRequest->started_at
                ) {
                    $updateData['started_at'] = now();
                }

                if (
                    $validated['status'] === 'completed'
                ) {
                    $updateData['completed_at'] = now();
                }

                $maintenanceRequest->update(
                    $updateData
                );
            }


            // อัปเดตยอด Invoice ให้ตรงกับ Repair Log
            $this->syncInvoice(
                $maintenanceRequest->id
            );


            return response()->json([
                'message' =>
                    'บันทึกประวัติการซ่อมสำเร็จ',

                'data' =>
                    $log->load(
                        'technician:id,name,email'
                    ),
            ], 201);
        });
    }


    public function show(
        MaintenanceRepairLog $repairLog
    ) {
        return response()->json(
            $repairLog->load([
                'technician:id,name,email',
                'maintenanceRequest'
            ])
        );
    }


    public function update(
        Request $request,
        MaintenanceRepairLog $repairLog
    ) {
        $validated = $request->validate([
            'action' =>
                'sometimes|required|string|max:255',

            'repair_detail' =>
                'nullable|string',

            'labor_cost' =>
                'nullable|numeric|min:0',

            'parts_cost' =>
                'nullable|numeric|min:0',
        ]);

        return DB::transaction(function () use (
            $validated,
            $repairLog
        ) {
            $maintenanceRequestId =
                $repairLog->maintenance_request_id;

            $repairLog->update(
                $validated
            );


            // อัปเดต Invoice หลังแก้ Repair Log
            $this->syncInvoice(
                $maintenanceRequestId
            );


            return response()->json([
                'message' =>
                    'แก้ไขประวัติการซ่อมสำเร็จ',

                'data' =>
                    $repairLog->fresh(),
            ]);
        });
    }


    public function destroy(
        MaintenanceRepairLog $repairLog
    ) {
        return DB::transaction(function () use (
            $repairLog
        ) {
            $maintenanceRequestId =
                $repairLog->maintenance_request_id;

            $repairLog->delete();


            // อัปเดต Invoice หลังลบ Repair Log
            $this->syncInvoice(
                $maintenanceRequestId
            );


            return response()->json([
                'message' =>
                    'ลบประวัติการซ่อมสำเร็จ',
            ]);
        });
    }


    private function syncInvoice(
        int $maintenanceRequestId
    ): void {
        $invoice = MaintenanceInvoice::where(
            'maintenance_request_id',
            $maintenanceRequestId
        )->first();


        // ถ้ายังไม่มี Invoice ก็ไม่ต้อง Sync
        if (!$invoice) {
            return;
        }

        // ใบที่ชำระแล้วหรือยกเลิกแล้วเก็บยอดเดิมไว้เป็นหลักฐาน
        if ($invoice->payment_status !== 'unpaid') {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | รวมค่าใช้จ่ายจาก Repair Log ทั้งหมด
        |--------------------------------------------------------------------------
        */

        $laborCost =
            (float) MaintenanceRepairLog::where(
                'maintenance_request_id',
                $maintenanceRequestId
            )->sum('labor_cost');


        $partsCost =
            (float) MaintenanceRepairLog::where(
                'maintenance_request_id',
                $maintenanceRequestId
            )->sum('parts_cost');


        $totalAmount =
            $laborCost + $partsCost;


        /*
        |--------------------------------------------------------------------------
        | Update Invoice
        |--------------------------------------------------------------------------
        */

        $invoice->update([
            'labor_cost' =>
                $laborCost,

            'parts_cost' =>
                $partsCost,

            'total_amount' =>
                $totalAmount,
        ]);


        /*
        |--------------------------------------------------------------------------
        | Sync Invoice Items
        |--------------------------------------------------------------------------
        |
        | ใช้ Relation โดยตรง
        | Laravel จะใส่ maintenance_invoice_id ให้เอง
        |
        */

        $invoice->items()->delete();


        if ($laborCost > 0) {
            $invoice->items()->create([
                'description' =>
                    'ค่าแรง',

                'quantity' =>
                    1,

                'unit_price' =>
                    $laborCost,

                'subtotal' =>
                    $laborCost,
            ]);
        }


        if ($partsCost > 0) {
            $invoice->items()->create([
                'description' =>
                    'ค่าอะไหล่',

                'quantity' =>
                    1,

                'unit_price' =>
                    $partsCost,

                'subtotal' =>
                    $partsCost,
            ]);
        }
    }
}