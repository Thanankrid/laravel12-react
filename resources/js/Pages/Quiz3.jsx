import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

// สร้างชุดข้อมูลสำหรับแต่ละระดับคะแนน เพื่อให้จัดการสีและ Emoji ได้ง่ายขึ้น
const ratingConfig = {
  0: { text: "คลิกเพื่อประเมินความพึงพอใจ", color: "#a4b0be", emoji: "🤔", shadow: "none" },
  1: { text: "ต้องปรับปรุงอย่างด่วน 🚨", color: "#ff4757", emoji: "😡", shadow: "0px 10px 20px rgba(255, 71, 87, 0.4)" },
  2: { text: "พอใช้ได้ 😅", color: "#ffa502", emoji: "😟", shadow: "0px 10px 20px rgba(255, 165, 2, 0.4)" },
  3: { text: "ปานกลาง 🙂", color: "#eccc68", emoji: "😐", shadow: "0px 10px 20px rgba(236, 204, 104, 0.4)" },
  4: { text: "ดีเลยทีเดียว! 😃", color: "#2ed573", emoji: "😊", shadow: "0px 10px 20px rgba(46, 213, 115, 0.4)" },
  5: { text: "สุดยอดไปเลย! 🌟", color: "#f1c40f", emoji: "🤩", shadow: "0px 0px 30px rgba(241, 196, 15, 0.8)" }
};

export default function Quiz3() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentValue = hover || rating;
  const currentConfig = ratingConfig[currentValue];

  const handleRatingClick = (star) => {
    setRating(star);
    // ทำให้อีโมจิเด้งเวลาผู้ใช้กดเลือกคะแนน
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSubmit = () => {
    if (rating > 0) setIsSubmitted(true);
  };

  return (
    <BootstrapLayout>
      <Head title="Star Rating Pro - Wow Edition" />
      
      {/* แทรก CSS Animations ลงใน Component โดยตรงเพื่อความสะดวก */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          transition: all 0.4s ease;
        }
        .star-item {
          font-size: 65px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-block;
        }
        .star-item:hover {
          transform: scale(1.3) translateY(-10px) !important;
        }
        .emoji-display {
          font-size: 80px;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .pop-animation {
          animation: popBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .submit-btn-pulse {
          animation: pulseGlow 1.5s infinite;
        }
        .fade-up-enter {
          animation: fadeUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
        
        @keyframes popBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.4) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(46, 213, 115, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(46, 213, 115, 0); }
          100% { box-shadow: 0 0 0 0 rgba(46, 213, 115, 0); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        
        {/* Card พร้อม Dynamic Shadow ตามระดับคะแนน */}
        <div 
          className="card p-5 text-center glass-card" 
          style={{ 
            width: '550px',
            boxShadow: currentValue > 0 ? currentConfig.shadow : '0 20px 40px rgba(0,0,0,0.08)'
          }}
        >
          
          {isSubmitted ? (
            // ==========================================
            // หน้าจอ: เมื่อกดส่งข้อมูลแล้ว (Success State)
            // ==========================================
            <div className="fade-up-enter">
              <div className="mb-3" style={{ fontSize: '100px', lineHeight: '1' }}>🎉</div>
              <h1 className="fw-bolder mb-3" style={{ color: currentConfig.color }}>ขอบคุณสำหรับรีวิว!</h1>
              
              <div className="p-3 mb-4 rounded-4 mx-auto" style={{ backgroundColor: '#f8f9fa', width: 'fit-content' }}>
                <span className="fs-5 text-muted me-2">คะแนนของคุณ:</span>
                <span className="fs-4 fw-bold" style={{ color: currentConfig.color }}>
                  {rating} / 5 {currentConfig.emoji}
                </span>
              </div>

              <button 
                className="btn btn-light mt-2 rounded-pill px-5 py-3 fw-bold text-muted shadow-sm hover-shadow"
                style={{ transition: 'all 0.3s' }}
                onClick={() => { setIsSubmitted(false); setRating(0); setHover(0); }}
              >
                <i className="bi bi-arrow-counterclockwise"></i> ประเมินใหม่อีกครั้ง
              </button>
            </div>
          ) : (
            // ==========================================
            // หน้าจอ: ตอนกำลังให้คะแนน (Rating State)
            // ==========================================
            <div className="fade-up-enter">
              <h2 className="mb-2 fw-bold" style={{ color: '#2f3542' }}>ประสบการณ์ของคุณเป็นอย่างไร?</h2>
              <p className="text-muted mb-4">ความคิดเห็นของคุณช่วยให้เราพัฒนาให้ดีขึ้น</p>
              
              {/* Emoji แสดงผลแบบ Dynamic พร้อม Animation */}
              <div className={`emoji-display mb-3 ${isAnimating ? 'pop-animation' : ''}`}>
                {currentConfig.emoji}
              </div>

              {/* โซนให้ดาว */}
              <div className="d-flex justify-content-center gap-3 mb-4">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= currentValue;
                  return (
                    <span
                      key={star}
                      className="star-item"
                      style={{
                        color: isActive ? currentConfig.color : '#dfe4ea',
                        textShadow: isActive ? currentConfig.shadow : 'none',
                        transform: star <= hover ? 'scale(1.25) translateY(-8px)' : 'scale(1) translateY(0)'
                      }}
                      onClick={() => handleRatingClick(star)}
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
                className="fw-bold mb-4"
                style={{ 
                  color: currentConfig.color,
                  minHeight: '30px',
                  transition: 'color 0.3s ease'
                }}
              >
                {currentConfig.text}
              </h4>

              {/* ปุ่มกดส่ง - มีลูกเล่น Pulse ตอนที่ให้คะแนนแล้ว */}
              <button 
                className={`btn rounded-pill px-5 py-3 fs-5 fw-bold text-white border-0 w-100 ${rating > 0 ? 'submit-btn-pulse' : 'disabled'}`}
                style={{ 
                  backgroundColor: rating > 0 ? currentConfig.color : '#a4b0be',
                  transition: 'all 0.4s ease',
                  opacity: rating > 0 ? 1 : 0.6
                }}
                onClick={handleSubmit}
              >
                ส่งความพึงพอใจ 🚀
              </button>
            </div>
          )}

        </div>
      </div>
    </BootstrapLayout>
  );
}