<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Wireless Mouse',
                'description' => 'A comfortable wireless mouse with advanced precision.',
                'price' => 25.99,
                'image' => 'https://picsum.photos/210',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mechanical Keyboard',
                'description' => 'A high-performance mechanical keyboard for gaming.',
                'price' => 79.99,
                'image' => 'https://picsum.photos/211',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gaming Headset',
                'description' => 'Immersive audio experience for gaming and entertainment.',
                'price' => 49.99,
                'image' => 'https://picsum.photos/212',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Laptop Stand',
                'description' => 'Adjustable laptop stand for ergonomic positioning.',
                'price' => 29.99,
                'image' => 'https://picsum.photos/213',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'USB-C Hub',
                'description' => 'Multi-port USB-C hub for all your connectivity needs.',
                'price' => 39.99,
                'image' => 'https://picsum.photos/214',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '4K Monitor',
                'description' => 'Ultra HD 4K monitor for superior clarity and color.',
                'price' => 299.99,
                'image' => 'https://picsum.photos/215',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'External Hard Drive',
                'description' => '1TB external hard drive for secure data storage.',
                'price' => 59.99,
                'image' => 'https://picsum.photos/216',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Portable Charger',
                'description' => 'Compact and powerful portable charger for on-the-go charging.',
                'price' => 19.99,
                'image' => 'https://picsum.photos/217',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bluetooth Speaker',
                'description' => 'Portable Bluetooth speaker with deep bass and clear sound.',
                'price' => 45.99,
                'image' => 'https://picsum.photos/218',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Smartphone Stand',
                'description' => 'Convenient stand for smartphones and small tablets.',
                'price' => 15.99,
                'image' => 'https://picsum.photos/219',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}