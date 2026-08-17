<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // แสดงรายการทั้งหมดของสินค้า
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // แสดงรายละเอียดของสินค้าเฉพาะรายการ
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    // เพิ่มสินค้าใหม่
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|url',
        ]);        

        $product = Product::create($validated);

        return response()->json(['message' => 'Product created successfully!', 'product' => $product], 201);
    }

    // อัปเดตสินค้าที่มีอยู่
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|url',
        ]);

        $product->update($validated);

        return response()->json(['message' => 'Product updated successfully!', 'product' => $product]);
    }

    // ลบสินค้าที่มีอยู่
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully!']);
    }
}