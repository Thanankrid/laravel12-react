<?php

namespace App\Http\Controllers;

use App\Models\Weight;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeightController extends Controller
{
    // โหลดหน้า Dashboard พร้อมดึงข้อมูลทั้งหมด
    public function index()
    {
        $weights = Weight::orderBy('recorded_at', 'asc')->get();
        return Inertia::render('Weights/Dashboard', ['weights' => $weights]);
    }

    // บันทึกข้อมูลใหม่
    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:1|max:300',
            'recorded_at' => 'required|date|unique:weights,recorded_at',
        ], [
            'recorded_at.unique' => 'วันนี้คุณบันทึกน้ำหนักไปแล้ว กรุณากดแก้ไขข้อมูลเดิมครับ',
        ]);

        Weight::create($validated);
        return redirect()->back(); // กลับหน้าเดิม ข้อมูลจะอัปเดตเองผ่าน Inertia
    }

    // อัปเดตข้อมูลเดิม
    public function update(Request $request, Weight $weight)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:1|max:300',
            'recorded_at' => 'required|date|unique:weights,recorded_at,' . $weight->id,
        ]);

        $weight->update($validated);
        return redirect()->back();
    }

    // ลบข้อมูล
    public function destroy(Weight $weight)
    {
        $weight->delete();
        return redirect()->back();
    }
}