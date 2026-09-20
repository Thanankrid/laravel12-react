<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ผู้แจ้งต้องยืนยันว่างานเสร็จจริงก่อนปิดงานและออกใบแจ้งหนี้
    public function up(): void
    {
        Schema::table('maintenance_requests', function (Blueprint $table) {
            $table->string('status', 30)->default('pending')->change();
            $table->timestamp('handed_over_at')->nullable()->after('started_at');
            $table->timestamp('confirmed_at')->nullable()->after('completed_at');
            $table->foreignId('confirmed_by')->nullable()->after('confirmed_at')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('maintenance_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('confirmed_by');
            $table->dropColumn(['handed_over_at', 'confirmed_at']);
        });
    }
};
