<?php

namespace App\Http\Controllers\Api\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // คุยกันได้เฉพาะคนที่เกี่ยวข้องกับงานนี้: ผู้แจ้ง ช่างที่รับงาน และ Admin
    private function authorizeChat(Request $request, MaintenanceRequest $maintenanceRequest): void
    {
        $user = $request->user();

        abort_unless(
            $user->role === 'admin'
                || $maintenanceRequest->user_id === $user->id
                || $maintenanceRequest->technician_id === $user->id,
            403,
            'ไม่มีสิทธิ์เข้าถึงการสนทนาของงานนี้'
        );
    }

    public function index(
        Request $request,
        MaintenanceRequest $maintenanceRequest
    ) {
        $this->authorizeChat($request, $maintenanceRequest);

        $messages = $maintenanceRequest->messages()
            ->with('sender:id,name,role')
            ->when(
                $request->filled('after'),
                fn ($query) => $query->where('id', '>', (int) $request->input('after'))
            )
            ->orderBy('id')
            ->limit(200)
            ->get();

        return response()->json($messages);
    }

    public function store(
        Request $request,
        MaintenanceRequest $maintenanceRequest
    ) {
        $this->authorizeChat($request, $maintenanceRequest);

        $validated = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $message = $maintenanceRequest->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        return response()->json(
            $message->load('sender:id,name,role'),
            201
        );
    }
}
