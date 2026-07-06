<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('iot_components', function (Blueprint $table) {
            $table->id(); // คอลัมน์ที่ 1: ID
            $table->string('name'); // คอลัมน์ที่ 2: ชื่ออุปกรณ์
            $table->string('board_type'); // คอลัมน์ที่ 3: ประเภทบอร์ด/ชนิดอุปกรณ์
            $table->integer('price'); // คอลัมน์ที่ 4: ราคา
            $table->integer('stock_quantity'); // คอลัมน์ที่ 5: จำนวนในสต็อก
            $table->text('description')->nullable(); // คอลัมน์ที่ 6: คำอธิบาย
            $table->timestamps(); // คอลัมน์ที่ 7, 8: created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('iot_components');
    }
};