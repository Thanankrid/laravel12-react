<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // เก็บหลักฐานการชำระเงิน (ระบบชำระเงินจำลอง)
    public function up(): void
    {
        Schema::table('maintenance_invoices', function (Blueprint $table) {
            $table->timestamp('paid_at')->nullable()->after('payment_status');
            $table->string('payment_method', 20)->nullable()->after('paid_at');
            $table->string('payment_ref', 40)->nullable()->unique()->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('maintenance_invoices', function (Blueprint $table) {
            $table->dropUnique(['payment_ref']);
            $table->dropColumn(['paid_at', 'payment_method', 'payment_ref']);
        });
    }
};
