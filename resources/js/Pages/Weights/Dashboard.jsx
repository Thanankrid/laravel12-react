import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BootstrapLayout from "@/Layouts/BootstrapLayout";

export default function Dashboard({ weights }) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        weight: '',
        recorded_at: today,
    });

    // ฟังก์ชันใหม่: ปุ่มปรับลด/เพิ่ม น้ำหนักแบบด่วน
    const adjustWeight = (amount) => {
        // แปลงค่าปัจจุบันเป็นตัวเลข ถ้าช่องว่างอยู่ให้เริ่มที่ 0
        const currentWeight = parseFloat(data.weight) || 0;
        // ป้องกันไม่ให้น้ำหนักติดลบ และล็อคทศนิยม 2 ตำแหน่ง
        const newWeight = Math.max(0, currentWeight + amount).toFixed(2);
        setData('weight', newWeight);
    };

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditMode(false);
        setEditId(null);
        setShowModal(true);
    };

    const openEditModal = (item) => {
        clearErrors();
        setEditMode(true);
        setEditId(item.id);
        setData({
            weight: item.weight,
            recorded_at: item.recorded_at,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => reset(), 300); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(`/weights/${editId}`, { onSuccess: () => closeModal() });
        } else {
            post('/weights', { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm('ยืนยันการลบข้อมูลนี้ใช่หรือไม่? ข้อมูลที่ลบจะไม่สามารถกู้คืนได้')) {
            destroy(`/weights/${id}`);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-lg rounded-4 border-0" style={{ minWidth: '120px' }}>
                    <p className="text-muted mb-1 small fw-bold">📅 {label}</p>
                    <h4 className="fw-bolder text-primary mb-0">{payload[0].value} <span className="fs-6 text-muted">กก.</span></h4>
                </div>
            );
        }
        return null;
    };

    return (
        <BootstrapLayout>
            <Head title="ระบบติดตามน้ำหนัก" />

            <style>
                {`
                    .pro-card {
                        background: #ffffff;
                        border-radius: 24px;
                        border: 1px solid rgba(0,0,0,0.04);
                        box-shadow: 0 10px 40px rgba(0,0,0,0.06);
                        transition: all 0.3s ease;
                    }
                    .pro-card:hover { box-shadow: 0 15px 50px rgba(0,0,0,0.1); transform: translateY(-3px); }
                    .pro-btn { transition: all 0.2s; letter-spacing: 0.5px; }
                    .pro-btn:active { transform: scale(0.96); }
                    .table-modern th { background: #f8f9fa; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; border-bottom: 2px solid #edf2f9; padding: 1rem; }
                    .table-modern td { vertical-align: middle; padding: 1.2rem 1rem; color: #495057; border-bottom: 1px solid #f1f4f8; }
                    .table-modern tbody tr:hover { background-color: #fcfdfe; }
                    .modal-backdrop.custom-backdrop { background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); }
                    
                    /* ดีไซน์ช่องกรอกตัวเลขแบบใหม่ ซ่อนลูกศรขึ้นลงกากๆ ของเบราว์เซอร์ */
                    .input-pro { border-radius: 16px; border: 2px solid #e2e8f0; background-color: #f8fafc; transition: all 0.2s; }
                    .input-pro:focus { border-color: #3b82f6; background-color: #fff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); outline: none; }
                    input[type="number"]::-webkit-inner-spin-button, 
                    input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                    input[type="number"] { -moz-appearance: textfield; }

                    .adjust-btn { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 14px; transition: all 0.2s; border: none; }
                    .adjust-btn:active { transform: scale(0.9); }
                    .adjust-btn.minus { background: #fee2e2; color: #ef4444; }
                    .adjust-btn.minus:hover { background: #fecaca; }
                    .adjust-btn.plus { background: #dcfce3; color: #22c55e; }
                    .adjust-btn.plus:hover { background: #bbf7d0; }
                `}
            </style>

            <div className="container py-5" style={{ maxWidth: '1100px' }}>
                
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bolder mb-1" style={{ color: '#1e293b' }}>Weight Tracker</h2>
                        <p className="text-secondary mb-0">ระบบติดตามและวิเคราะห์น้ำหนักแบบเรียลไทม์</p>
                    </div>
                    <button onClick={openAddModal} className="btn btn-primary btn-lg rounded-pill shadow-sm fw-bold px-4 py-3 pro-btn d-flex align-items-center gap-2">
                        <span className="fs-5">+</span> บันทึกน้ำหนักใหม่
                    </button>
                </div>

                {/* Chart Section */}
                <div className="pro-card mb-5 overflow-hidden">
                    <div className="p-4 border-bottom" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
                        <h5 className="fw-bold mb-0 text-dark">📈 กราฟแนวโน้มน้ำหนัก</h5>
                    </div>
                    <div className="p-4" style={{ height: '400px', backgroundColor: '#fcfdfe' }}>
                        {weights.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weights} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="recorded_at" tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={4} fill="url(#colorWeight)" activeDot={{ r: 8, fill: '#fff', stroke: '#3b82f6', strokeWidth: 3 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="d-flex h-100 flex-column justify-content-center align-items-center text-muted">
                                <div className="fs-1 mb-3">📊</div>
                                <h5 className="fw-bold text-secondary">ยังไม่มีข้อมูลสำหรับวิเคราะห์</h5>
                                <p>กดปุ่ม "บันทึกน้ำหนักใหม่" ด้านบนเพื่อเริ่มต้น</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Section */}
                <div className="pro-card overflow-hidden">
                    <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0 text-dark">📋 ประวัติย้อนหลัง</h5>
                        <span className="badge bg-light text-secondary rounded-pill px-3 py-2 border">{weights.length} รายการ</span>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-modern mb-0 w-100">
                            <thead>
                                <tr>
                                    <th className="ps-4">วันที่บันทึก</th>
                                    <th className="text-center">น้ำหนัก (กิโลกรัม)</th>
                                    <th className="text-end pe-4">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weights.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-5">
                                            <span className="text-muted">ยังไม่มีประวัติการบันทึก</span>
                                        </td>
                                    </tr>
                                )}
                                {[...weights].reverse().map((w) => (
                                    <tr key={w.id}>
                                        <td className="ps-4 fw-bold text-dark">{w.recorded_at}</td>
                                        <td className="text-center">
                                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fs-6 fw-bold">
                                                {w.weight} กก.
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button onClick={() => openEditModal(w)} className="btn btn-sm btn-light text-primary rounded-circle me-2 pro-btn shadow-sm border" style={{ width: '40px', height: '40px' }} title="แก้ไข">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(w.id)} className="btn btn-sm btn-light text-danger rounded-circle pro-btn shadow-sm border" style={{ width: '40px', height: '40px' }} title="ลบ">
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal (Popup) */}
                {showModal && (
                    <>
                        <div className="modal-backdrop custom-backdrop fade show" style={{ zIndex: 1040 }}></div>
                        
                        <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1" onClick={closeModal}>
                            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                                <div className="modal-content border-0 shadow" style={{ borderRadius: '28px', overflow: 'hidden' }}>
                                    
                                    <div className="modal-header border-0 pb-0 pt-4 px-4 align-items-center">
                                        <h4 className="modal-title fw-bolder" style={{ color: '#1e293b' }}>
                                            {editMode ? 'แก้ไขข้อมูล ✏️' : 'บันทึกน้ำหนัก ⚖️'}
                                        </h4>
                                        <button type="button" className="btn-close bg-light rounded-circle p-2" onClick={closeModal}></button>
                                    </div>

                                    <div className="modal-body p-4">
                                        <form onSubmit={handleSubmit}>
                                            
                                            <div className="mb-4">
                                                <label className="form-label text-secondary fw-bold ms-1 mb-2">วันที่บันทึก</label>
                                                <input
                                                    type="date"
                                                    className={`form-control input-pro px-3 py-3 ${errors.recorded_at ? 'is-invalid border-danger' : ''}`}
                                                    value={data.recorded_at}
                                                    onChange={(e) => setData('recorded_at', e.target.value)}
                                                />
                                                {errors.recorded_at && <div className="invalid-feedback ms-1 mt-2 fw-bold">{errors.recorded_at}</div>}
                                            </div>

                                            <div className="mb-5">
                                                <label className="form-label text-secondary fw-bold ms-1 mb-3">น้ำหนักของคุณ (กก.)</label>
                                                
                                                {/* UI ปุ่มปรับน้ำหนักด่วน (Quick Adjust) */}
                                                <div className="d-flex align-items-center justify-content-between gap-2">
                                                    
                                                    {/* กลุ่มปุ่มลดน้ำหนัก */}
                                                    <div className="d-flex flex-column gap-2">
                                                        <button type="button" onClick={() => adjustWeight(-1)} className="adjust-btn minus">-1.0</button>
                                                        <button type="button" onClick={() => adjustWeight(-0.1)} className="adjust-btn minus">-0.1</button>
                                                    </div>

                                                    {/* ช่องกรอกตรงกลาง (ลูกศรถูกซ่อนแล้ว) */}
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        autoFocus
                                                        placeholder="0.00"
                                                        className={`form-control input-pro fw-bold text-primary ${errors.weight ? 'is-invalid border-danger' : ''}`}
                                                        value={data.weight}
                                                        onChange={(e) => setData('weight', e.target.value)}
                                                        style={{ fontSize: '40px', textAlign: 'center', height: '100px', flex: 1 }}
                                                    />

                                                    {/* กลุ่มปุ่มเพิ่มน้ำหนัก */}
                                                    <div className="d-flex flex-column gap-2">
                                                        <button type="button" onClick={() => adjustWeight(+1)} className="adjust-btn plus">+1.0</button>
                                                        <button type="button" onClick={() => adjustWeight(+0.1)} className="adjust-btn plus">+0.1</button>
                                                    </div>

                                                </div>
                                                {errors.weight && <div className="text-danger text-center mt-3 fw-bold">{errors.weight}</div>}
                                            </div>

                                            <button type="submit" className={`btn btn-lg w-100 fw-bold text-white rounded-pill py-3 pro-btn shadow-sm d-flex justify-content-center align-items-center gap-2 ${editMode ? 'btn-warning' : 'btn-primary'}`} disabled={processing}>
                                                {processing ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    editMode ? 'อัปเดตข้อมูล' : 'ยืนยันการบันทึก'
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </BootstrapLayout>
    );
}