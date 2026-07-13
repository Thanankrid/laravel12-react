<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IotComponentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('iot_components')->insert([
            [
                'name' => 'WiFi MCU Module',
                'board_type' => 'ESP32',
                'price' => 250,
                'stock_quantity' => 50,
                'description' => 'Dual-core MCU with Wi-Fi and Bluetooth',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Power Toggle Button',
                'board_type' => 'Component',
                'price' => 15,
                'stock_quantity' => 100,
                'description' => 'Power toggle button wired to input Pin 2',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Stepper Motor',
                'board_type' => 'Actuator',
                'price' => 350,
                'stock_quantity' => 30,
                'description' => 'Used for automated bottle return bin',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Smoke Sensor',
                'board_type' => 'Arduino',
                'price' => 85,
                'stock_quantity' => 60,
                'description' => 'Gas and smoke detection module',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'NodeMCU',
                'board_type' => 'ESP8266',
                'price' => 120,
                'stock_quantity' => 100,
                'description' => 'Low-cost Wi-Fi microchip',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // นี่คือตัวที่ 6 ที่เพิ่มเข้ามาใหม่ครับ
            [
                'name' => 'Ultrasonic Sensor (HC-SR04)',
                'board_type' => 'Sensor',
                'price' => 45,
                'stock_quantity' => 200,
                'description' => 'Distance measuring sensor module',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}