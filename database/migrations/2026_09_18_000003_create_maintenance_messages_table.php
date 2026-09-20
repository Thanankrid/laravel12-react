<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ข้อความคุยกันระหว่างผู้แจ้ง ช่างที่รับงาน และผู้ดูแลระบบ ภายในงานซ่อมหนึ่งงาน
    public function up(): void
    {
        Schema::create('maintenance_messages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('maintenance_request_id')
                ->constrained('maintenance_requests')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->text('body');

            $table->timestamps();

            $table->index(['maintenance_request_id', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_messages');
    }
};
