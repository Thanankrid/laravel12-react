<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // รายละเอียดสถานที่เพิ่มเติม เช่น ชั้น ห้อง หรือจุดสังเกต
    public function up(): void
    {
        Schema::table('maintenance_requests', function (Blueprint $table) {
            $table->string('location_note', 255)->nullable()->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('maintenance_requests', function (Blueprint $table) {
            $table->dropColumn('location_note');
        });
    }
};
