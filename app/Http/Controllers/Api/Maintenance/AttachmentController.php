<?php

namespace App\Http\Controllers\Api\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceAttachment;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    // รูปภาพและวิดีโอเป็นหลักฐานของงานซ่อม จึงเก็บนอก public แล้วเสิร์ฟผ่าน route ที่ตรวจสิทธิ์
    public function store(
        Request $request,
        MaintenanceRequest $maintenanceRequest
    ) {
        $user = $request->user();

        // ผู้แจ้ง ช่างที่รับงาน และ Admin แนบไฟล์ได้
        abort_unless(
            $user->role === 'admin'
                || $maintenanceRequest->user_id === $user->id
                || $maintenanceRequest->technician_id === $user->id,
            403,
            'ไม่มีสิทธิ์แนบไฟล์กับงานนี้'
        );

        // งานที่ปิดแล้วล็อกหลักฐานไว้
        abort_if(
            in_array($maintenanceRequest->status, ['completed', 'cancelled'], true),
            409,
            'งานนี้ปิดแล้ว ไม่สามารถแนบไฟล์เพิ่มได้'
        );

        abort_if(
            $maintenanceRequest->attachments()->count() >= 10,
            422,
            'แนบไฟล์ได้สูงสุด 10 ไฟล์ต่อหนึ่งงาน'
        );

        $request->validate([
            'file' => 'required|file|max:25600|mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime',
        ]);

        $file = $request->file('file');
        $path = $file->store('maintenance-attachments', 'local');

        abort_unless($path, 500, 'บันทึกไฟล์ไม่สำเร็จ');

        $attachment = $maintenanceRequest->attachments()->create([
            'user_id' => $user->id,
            'original_name' => mb_substr(
                preg_replace('/[\x00-\x1F\x7F\/\\\\]/u', '_', $file->getClientOriginalName()),
                0,
                150
            ),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json(
            $attachment->load('uploader:id,name'),
            201
        );
    }

    // ส่งไฟล์ให้ผู้ใช้ที่ล็อกอินแล้วเท่านั้น (BinaryFileResponse รองรับการเล่นวิดีโอแบบ seek)
    public function show(MaintenanceAttachment $attachment)
    {
        abort_unless(
            Storage::disk('local')->exists($attachment->path),
            404,
            'ไม่พบไฟล์'
        );

        return response()->file(
            Storage::disk('local')->path($attachment->path),
            [
                'Content-Type' => $attachment->mime_type,
                'Content-Disposition' => 'inline; filename="' . $attachment->original_name . '"',
            ]
        );
    }

    public function destroy(
        Request $request,
        MaintenanceAttachment $attachment
    ) {
        $user = $request->user();

        abort_unless(
            $user->role === 'admin' || $attachment->user_id === $user->id,
            403,
            'ลบได้เฉพาะผู้อัปโหลดหรือผู้ดูแลระบบ'
        );

        abort_if(
            in_array($attachment->request->status, ['completed', 'cancelled'], true),
            409,
            'งานนี้ปิดแล้ว ไฟล์หลักฐานถูกล็อกไว้'
        );

        Storage::disk('local')->delete($attachment->path);
        $attachment->delete();

        return response()->json([
            'message' => 'ลบไฟล์แล้ว',
        ]);
    }
}
