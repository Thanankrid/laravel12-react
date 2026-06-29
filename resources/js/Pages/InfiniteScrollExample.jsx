import BootstrapLayout from "@/layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

function InfiniteScrollExample() {
    const [data, setData] = useState([]); // เก็บข้อมูล
    const [page, setPage] = useState(1); // เก็บหน้าเพจ
    const [loading, setLoading] = useState(false); // ตรวจสอบสถานะการโหลด
    const [hasMore, setHasMore] = useState(true); // ตรวจสอบว่ามีข้อมูลอีกไหม

    // ฟังก์ชัน fetch data
    const fetchData = async (pageNum) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=10`
            );
            const newData = await response.json();

            if (newData.length === 0) {
                setHasMore(false); // ถ้าไม่มีข้อมูลใหม่ให้หยุดโหลด
            } else {
                setData((prev) => [...prev, ...newData]); // รวมข้อมูลใหม่กับข้อมูลเดิม
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    // ฟังก์ชันสำหรับการตรวจสอบการ scroll
    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 1 &&
            hasMore &&
            !loading
        ) {
            setPage((prev) => prev + 1); // เพิ่ม page เมื่อถึงจุดล่างสุด
        }
    };

    useEffect(() => {
        fetchData(page); // โหลดข้อมูลเมื่อ page เปลี่ยน
    }, [page]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll); // ลบ event เมื่อ component ถูกลบ
    }, [hasMore, loading]);

    return (
        <BootstrapLayout>
            <div className="container">
                <Head title="Counter" />
                <h1>Infinite Scroll Example</h1>.

                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {data.map((item, index) => (
                        <div className="col">
                            <div className="card h-100">
                                <img src={"https://picsum.photos/200/"+(100+index)} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="card-text">{ item.body }</p>
                                </div>
                                <button className="btn btn-danger" onClick={() => removeItem(index)}> <i className="bi bi-trash"></i> Remove </button>
                            </div>
                        </div>
                    ))}
                </div>
               
               
                {loading && <p>Loading more...</p>}
                {!hasMore && <p>No more data to load.</p>}
            </div>
            <div style={{ position: "absolute", bottom: "50%",  left: "50px" }}>{page}</div>
        </BootstrapLayout>
    );
}

export default InfiniteScrollExample;
