<?php

namespace App\Http\Controllers\Api\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MaintenanceRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = MaintenanceRequest::with([
            'requester:id,name,email',
            'technician:id,name,email'
        ]);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('request_no', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('equipment_type', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'equipment_type' => 'required|string|max:100',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $maintenanceRequest = MaintenanceRequest::create([
            ...$validated,
            'request_no' => 'TEMP-' . uniqid(),
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        $maintenanceRequest->update([
            'request_no' =>
            'MR-' .
                now()->format('Y') .
                '-' .
                str_pad(
                    $maintenanceRequest->id,
                    4,
                    '0',
                    STR_PAD_LEFT
                ),
        ]);

        return response()->json([
            'message' => 'สร้างใบแจ้งซ่อมสำเร็จ',
            'data' => $maintenanceRequest->fresh(),
        ], 201);
    }

    public function show(MaintenanceRequest $maintenanceRequest)
    {
        $maintenanceRequest->load([
            'requester',
            'technician',
            'repairLogs.technician',
            'invoice.items',
        ]);

        return response()->json($maintenanceRequest);
    }

    public function update(
        Request $request,
        MaintenanceRequest $maintenanceRequest
    ) {
        $user = $request->user();

        // ผู้แจ้งแก้ไขรายละเอียดได้ระหว่างรอดำเนินการ ส่วน Admin แก้ไขได้ทุกเมื่อ
        if ($request->hasAny(['title', 'equipment_type', 'location', 'description', 'priority'])) {
            abort_unless(
                $user->role === 'admin' || ($maintenanceRequest->user_id === $user->id && $maintenanceRequest->status === 'pending'),
                403,
                'ไม่มีสิทธิ์แก้ไขรายการแจ้งซ่อมนี้'
            );
        }

        // เปลี่ยนสถานะได้เฉพาะช่างที่รับงานนี้หรือ Admin
        if ($request->has('status')) {
            abort_unless(
                $user->role === 'admin' || $maintenanceRequest->technician_id === $user->id,
                403,
                'ไม่มีสิทธิ์เปลี่ยนสถานะงานนี้'
            );
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'equipment_type' => 'sometimes|required|string|max:100',
            'location' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'status' => 'sometimes|required|in:pending,assigned,in_progress,waiting_parts,completed,cancelled',
        ]);

        $maintenanceRequest->update($validated);

        // ยกเลิกงานแล้ว ใบแจ้งหนี้ที่ยังไม่ชำระก็ไม่ต้องเก็บเงิน
        if (($validated['status'] ?? null) === 'cancelled') {
            $maintenanceRequest->invoice()
                ->where('payment_status', 'unpaid')
                ->update(['payment_status' => 'cancelled']);
        }

        if (
            isset($validated['status']) &&
            $validated['status'] === 'in_progress' &&
            !$maintenanceRequest->started_at
        ) {
            $maintenanceRequest->update([
                'started_at' => now()
            ]);
        }

        if (
            isset($validated['status']) &&
            $validated['status'] === 'completed'
        ) {
            $maintenanceRequest->update([
                'completed_at' => now()
            ]);
        }

        return response()->json([
            'message' => 'อัปเดตข้อมูลสำเร็จ',
            'data' => $maintenanceRequest->fresh(),
        ]);
    }

    public function destroy(Request $request, MaintenanceRequest $maintenanceRequest)
    {
        // ผู้แจ้งลบได้ระหว่างรอดำเนินการ ส่วน Admin ลบได้ทุกเมื่อ
        abort_unless(
            $request->user()->role === 'admin' || ($maintenanceRequest->user_id === $request->user()->id && $maintenanceRequest->status === 'pending'),
            403,
            'ไม่มีสิทธิ์ลบรายการแจ้งซ่อมนี้'
        );

        $maintenanceRequest->delete();

        return response()->json([
            'message' => 'ลบใบแจ้งซ่อมสำเร็จ',
        ]);
    }

    public function assignTechnician(
    Request $request,
    MaintenanceRequest $maintenanceRequest
) {
    $validated = $request->validate([
        // มอบหมายได้เฉพาะผู้ใช้ที่เป็นช่าง
        'technician_id' => ['required', Rule::exists('users', 'id')->where('role', 'technician')],
    ]);

    $maintenanceRequest->update([
        'technician_id' => $validated['technician_id'],
        'status' => 'assigned',
        'assigned_at' => now(),
    ]);

    $maintenanceRequest->load('technician');

    return response()->json($maintenanceRequest);
}
}
