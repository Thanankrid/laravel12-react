import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function StarRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  // State ใหม่สำหรับจำว่าผู้ใช้กดส่งข้อมูลไปหรือยัง
  const [isSubmitted, setIsSubmitted] = useState(false); 

  // ข้อความ Feedback 
  const feedbackText = ["คลิกเพื่อประเมินความพึงพอใจ", "ต้องปรับปรุงอย่างด่วน 🚨", "พอใช้ได้ 😅", "ปานกลาง 🙂", "ดีเลยทีเดียว! 😃", "สุดยอดไปเลย! 🌟"];

  // ฟังก์ชันจัดการตอนกดปุ่มส่ง
  const handleSubmit = () => {
    if (rating > 0) {
      setIsSubmitted(true); // เปลี่ยนสภาวะเป็นส่งแล้ว
    }
  };

  return (
    <BootstrapLayout>
      <Head title="Star Rating Pro" />
      
      {/* ใช้ d-flex จัดให้อยู่กึ่งกลางหน้าจอ */}
      <div className="container mt-5 d-flex justify-content-center">
        
        {/* สร้างกรอบ Card สวยๆ มีเงา (shadow-lg) */}
        <div className="card shadow-lg p-5 text-center" style={{ width: '500px', borderRadius: '25px', border: 'none' }}>
          
          {isSubmitted ? (
            // ==========================================
            // หน้าจอ: เมื่อกดส่งข้อมูลแล้ว
            // ==========================================
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <h1 style={{ fontSize: '80px' }}>🎉</h1>
              <h2 className="text-success mt-3 fw-bold">ขอบคุณสำหรับรีวิว!</h2>
              <p className="text-muted fs-5">คุณให้คะแนนเรา {rating} ดาว</p>
              <button 
                className="btn btn-outline-primary mt-4 rounded-pill px-4" 
                onClick={() => { setIsSubmitted(false); setRating(0); setHover(0); }}
              >
                ประเมินใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            // ==========================================
            // หน้าจอ: ตอนกำลังให้คะแนน
            // ==========================================
            <>
              <h2 className="mb-4 fw-bold" style={{ color: '#2c3e50' }}>ประเมินบริการของเรา</h2>
              
              <div className="d-flex justify-content-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= (hover || rating);
                  return (
                    <span
                      key={star}
                      style={{
                        fontSize: '60px',
                        cursor: 'pointer',
                        color: isActive ? '#FFD700' : '#E4E5E9',
                        // ใส่ลูกเล่นเรืองแสง (Glow) และการเด้ง
                        textShadow: isActive ? '0px 0px 20px rgba(255, 215, 0, 0.8)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transform: star <= hover ? 'scale(1.2) translateY(-10px)' : 'scale(1) translateY(0)'
                      }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      ★
                    </span>
                  );
                })}
              </div>

              {/* ข้อความแสดงตามคะแนน */}
              <h4 
                style={{ 
                  color: rating > 0 || hover > 0 ? '#198754' : '#6c757d',
                  minHeight: '35px',
                  transition: 'color 0.3s'
                }}
              >
                {feedbackText[hover || rating]}
              </h4>

              {/* ปุ่มกดส่ง จะใช้งานได้ก็ต่อเมื่อให้ดาวแล้ว (rating > 0) */}
              <button 
                className={`btn mt-4 rounded-pill px-5 py-2 fs-5 text-white ${rating > 0 ? 'bg-primary' : 'bg-secondary disabled'}`}
                style={{ transition: 'all 0.3s', border: 'none' }}
                onClick={handleSubmit}
              >
                ส่งความพึงพอใจ 🚀
              </button>
            </>
          )}

        </div>
      </div>
    </BootstrapLayout>
  );
}