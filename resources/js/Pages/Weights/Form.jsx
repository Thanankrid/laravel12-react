import React from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function Form({ weightData }) {
    // เช็คว่าเป็นการ Edit หรือ Create[cite: 12]
    const isEdit = !!weightData; 

    // ใช้ useForm ของ Inertia จัดการ State และ Error[cite: 12]
    const { data, setData, post, put, errors, processing } = useForm({
        weight: weightData ? weightData.weight : '',
        recorded_at: weightData ? weightData.recorded_at : '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/weights/${weightData.id}`); // อัปเดตข้อมูล[cite: 12]
        } else {
            post('/weights'); // สร้างข้อมูลใหม่[cite: 12]
        }
    };

    return (
        <div className="container mx-auto p-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4">{isEdit ? 'แก้ไขข้อมูลน้ำหนัก' : 'บันทึกน้ำหนักใหม่'}</h2>

            <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
                <div className="mb-3">
                    <label className="form-label">น้ำหนัก (กิโลกรัม)</label>
                    <input
                        type="number"
                        step="0.01"
                        className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                        value={data.weight}
                        onChange={(e) => setData('weight', e.target.value)}
                    />
                    {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">วันที่บันทึก</label>
                    <input
                        type="date"
                        className={`form-control ${errors.recorded_at ? 'is-invalid' : ''}`}
                        value={data.recorded_at}
                        onChange={(e) => setData('recorded_at', e.target.value)}
                    />
                    {errors.recorded_at && <div className="invalid-feedback">{errors.recorded_at}</div>}
                </div>

                <div className="d-flex justify-content-between">
                    <Link href="/weights" className="btn btn-secondary">ยกเลิก</Link>
                    <button type="submit" className="btn btn-success" disabled={processing}>
                        บันทึกข้อมูล
                    </button>
                </div>
            </form>
        </div>
    );
}