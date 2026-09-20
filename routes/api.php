<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\Maintenance\AttachmentController;
use App\Http\Controllers\Api\Maintenance\MaintenanceRequestController;
use App\Http\Controllers\Api\Maintenance\MessageController;
use App\Http\Controllers\Api\Maintenance\TechnicianController;
use App\Http\Controllers\Api\Maintenance\RepairLogController;
use App\Http\Controllers\Api\Maintenance\InvoiceController;

Route::get('/components', function () {
    $components = DB::table('iot_components')->get();
    return response()->json($components);
});

Route::apiResource('/product', ProductController::class);

Route::post('/sanctum/token', function (Request $request) {
    $user = User::where('email', $request->email)->first();
    if (!$user || !Hash::check($request->password, $user->password)) {
        return ['email' => ['The provided credentials are incorrect.']];
    }
    return ['token' => $user->createToken($request->device_name)->plainTextToken];
});

Route::post('/sanctum/token/register', function (Request $request) {
    $user = User::where('email', $request->email)->first();
    if ($user) {
        return ['email' => ['The email is already in use.']];
    }
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);
    return ['token' => $user->createToken($request->device_name)->plainTextToken];
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});




// ==========================================
// Maintenance Request System
// ==========================================

Route::prefix('maintenance')
    ->middleware('auth:sanctum')
    ->group(function () {

        // มอบหมายช่างได้เฉพาะ Admin
        Route::put(
            'requests/{maintenanceRequest}/assign',
            [MaintenanceRequestController::class, 'assignTechnician']
        )->middleware('check.role:admin');

        Route::apiResource(
            'requests',
            MaintenanceRequestController::class
        )->parameters([
            'requests' => 'maintenanceRequest'
        ]);


        // การสนทนาระหว่างผู้แจ้งกับช่าง (ตรวจสิทธิ์ใน Controller)
        Route::get('requests/{maintenanceRequest}/messages', [MessageController::class, 'index']);
        Route::post('requests/{maintenanceRequest}/messages', [MessageController::class, 'store'])->middleware('throttle:60,1');

        // รูปภาพและวิดีโอประกอบงานซ่อม (ตรวจสิทธิ์ใน Controller)
        Route::post('requests/{maintenanceRequest}/attachments', [AttachmentController::class, 'store']);
        Route::get('attachments/{attachment}', [AttachmentController::class, 'show']);
        Route::delete('attachments/{attachment}', [AttachmentController::class, 'destroy']);

        // รายชื่อช่าง
        Route::get(
            'technicians',
            [TechnicianController::class, 'index']
        );


        // เฉพาะ Admin เท่านั้น
        Route::middleware('check.role:admin')
            ->group(function () {

                Route::get(
                    'users',
                    [TechnicianController::class, 'users']
                );

                Route::put(
                    'users/{user}/role',
                    [TechnicianController::class, 'updateRole']
                );
            });


        // ประวัติการซ่อม: ทุกคนดูได้ แต่บันทึก แก้ไข หรือลบได้เฉพาะช่างและ Admin
        Route::apiResource(
            'repair-logs',
            RepairLogController::class
        )->only(['index', 'show'])->parameters([
            'repair-logs' => 'repairLog'
        ]);

        Route::apiResource(
            'repair-logs',
            RepairLogController::class
        )->except(['index', 'show'])->parameters([
            'repair-logs' => 'repairLog'
        ])->middleware('check.role:technician,admin');

        // ใบแจ้งหนี้: ช่างและ Admin ดูรายการและสร้างได้ ยกเลิกหรือลบได้เฉพาะ Admin
        Route::apiResource(
            'invoices',
            InvoiceController::class
        )->only(['index', 'store'])->middleware('check.role:technician,admin');

        // ผู้แจ้งเปิดดูและชำระใบแจ้งหนี้ของตัวเองได้ (ตรวจสิทธิ์ใน Controller)
        Route::get('invoices/{invoice}', [InvoiceController::class, 'show']);
        Route::post('invoices/{invoice}/pay', [InvoiceController::class, 'pay']);

        Route::apiResource(
            'invoices',
            InvoiceController::class
        )->only(['update', 'destroy'])->middleware('check.role:admin');
    });
