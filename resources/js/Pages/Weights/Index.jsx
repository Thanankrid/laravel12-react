import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Index({ weights }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) {
            destroy(`/weights/${id}`);
        }
    };

    return (
        <div className="container mx-auto p-5" style={{ maxWidth: '800px' }}>
            <h2 className="text-2xl font-bold mb-5">ระบบติดตามน้ำหนัก</h2>

            {/* ส่วนแสดงกราฟ */}
            <div className="bg-white p-5 shadow rounded mb-5" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weights}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="recorded_at" />
                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="weight" stroke="#007bff" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ส่วนปุ่มและตาราง */}
            <div className="d-flex justify-content-between mb-3">
                <h4>ประวัติการบันทึก</h4>
                <Link href="/weights/create" className="btn btn-primary">
                    + เพิ่มน้ำหนักใหม่
                </Link>
            </div>

            <table className="table table-bordered bg-white shadow-sm">
                <thead className="table-light">
                    <tr>
                        <th>วันที่บันทึก</th>
                        <th>น้ำหนัก (กก.)</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {weights.length === 0 && (
                        <tr><td colSpan="3" className="text-center">ยังไม่มีข้อมูล</td></tr>
                    )}
                    {weights.map((w) => (
                        <tr key={w.id}>
                            <td>{w.recorded_at}</td>
                            <td>{w.weight}</td>
                            <td>
                                <Link href={`/weights/${w.id}/edit`} className="btn btn-sm btn-warning me-2">
                                    แก้ไข
                                </Link>
                                <button onClick={() => handleDelete(w.id)} className="btn btn-sm btn-danger">
                                    ลบ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}