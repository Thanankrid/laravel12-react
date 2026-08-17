<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weights', function (Blueprint $table) {
            $table->id();
            $table->decimal('weight', 5, 2); // ใช้ decimal เพื่อรองรับทศนิยม เช่น 65.50
            $table->date('recorded_at')->unique(); // ใส่วันที่ และตั้งค่า unique กันบันทึกซ้ำวันเดิม
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weights');
    }
};
