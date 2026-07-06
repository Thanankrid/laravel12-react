import React, { useState, useEffect } from 'react';

const Quiz4 = () => {
    // กำหนด State สำหรับเก็บข้อมูลที่ fetch มา และ state สำหรับสถานะการโหลด
    const [components, setComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ใช้ useEffect เพื่อ fetch ข้อมูลเมื่อ Component ถูก mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/api/components');
                const data = await response.json();
                setComponents(data);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>ตารางแสดงข้อมูลอุปกรณ์ IoT (Quiz 4)</h2>
            
            {isLoading ? (
                <p>กำลังโหลดข้อมูล...</p>
            ) : (
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead style={{ backgroundColor: '#f4f4f4' }}>
                        <tr>
                            <th>ID</th>
                            <th>ชื่ออุปกรณ์ (Name)</th>
                            <th>ประเภท (Board Type)</th>
                            <th>ราคา (Price)</th>
                            <th>จำนวนในสต็อก (Stock)</th>
                            <th>คำอธิบาย (Description)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {components.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.board_type}</td>
                                <td>{item.price} ฿</td>
                                <td>{item.stock_quantity}</td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Quiz4;