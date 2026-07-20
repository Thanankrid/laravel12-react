import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

// การตั้งค่าสำหรับดาว
const ratingConfig = {
  0: { text: "คลิกเพื่อประเมินความพึงพอใจ", color: "#a4b0be", emoji: "🤔", shadow: "none" },
  1: { text: "ต้องปรับปรุงอย่างด่วน 🚨", color: "#ff4757", emoji: "😡", shadow: "0px 10px 20px rgba(255, 71, 87, 0.4)" },
  2: { text: "พอใช้ได้ 😅", color: "#ffa502", emoji: "😟", shadow: "0px 10px 20px rgba(255, 165, 2, 0.4)" },
  3: { text: "ปานกลาง 🙂", color: "#eccc68", emoji: "😐", shadow: "0px 10px 20px rgba(236, 204, 104, 0.4)" },
  4: { text: "ดีเลยทีเดียว! 😃", color: "#2ed573", emoji: "😊", shadow: "0px 10px 20px rgba(46, 213, 115, 0.4)" },
  5: { text: "สุดยอดไปเลย! 🌟", color: "#f1c40f", emoji: "🤩", shadow: "0px 0px 30px rgba(241, 196, 15, 0.8)" }
};

// ชุดคำตอบสำเร็จรูป (Tags) เปลี่ยนไปตามคะแนนที่ให้
const positiveTags = ["บริการรวดเร็ว ⚡", "พนักงานสุภาพ 🧑‍💼", "คุ้มค่าราคา 💰", "บรรยากาศดี 🌴", "สะอาดสะอ้าน ✨"];
const negativeTags = ["รอนานเกินไป ⏳", "พนักงานไม่สนใจ 😒", "ราคาแพงเกินไป 💸", "สถานที่ไม่สะอาด 🧹", "ต้องปรับปรุง 🛠️"];

export default function Quiz3() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  // State สำหรับฟังก์ชันใหม่
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ref สำหรับเลื่อนหน้าจออัตโนมัติ
  const detailsRef = useRef(null);

  const currentValue = hover || rating;
  const currentConfig = ratingConfig[currentValue];

  // เมื่อเลือกดาวเสร็จ ให้เลื่อนหน้าจอลงมาที่ส่วนกรอกรายละเอียด
  const handleRatingClick = (star) => {
    setRating(star);
    setSelectedTags([]); // รีเซ็ต tags เมื่อเปลี่ยนคะแนน
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    // หน่วงเวลาเล็กน้อยแล้ว Scroll ลง
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    
    // จำลองการโหลดข้อมูล (Loading Effect)
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const currentTags = rating >= 4 ? positiveTags : negativeTags;

  return (
    <BootstrapLayout>
      <Head title="Feedback Pro Experience" />
      
      <style>{`
        body { background-color: #f8f9fa; }
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 25px;
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          transition: all 0.4s ease;
        }
        .star-item {
          font-size: 55px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-block;
        }
        .star-item:hover { transform: scale(1.3) translateY(-10px) !important; }
        .pop-animation { animation: popBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .reveal-section {
          animation: slideUpFade 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
        .tag-btn {
          border: 2px solid #e2e8f0;
          background: white;
          color: #64748b;
          border-radius: 50px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .tag-btn.active {
          border-color: ${currentConfig.color};
          background: ${currentConfig.color}15; /* สีโปร่งใส */
          color: ${currentConfig.color};
          transform: scale(1.05);
        }
        .custom-textarea {
          border: 2px solid #e2e8f0;
          border-radius: 15px;
          resize: none;
          transition: border-color 0.3s;
        }
        .custom-textarea:focus {
          border-color: ${currentConfig.color};
          box-shadow: 0 0 0 4px ${currentConfig.color}20;
          outline: none;
        }
        
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes popBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.4) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .spinner-border { width: 1.5rem; height: 1.5rem; }
      `}</style>

      <div className="container py-5" style={{ maxWidth: '700px' }}>
        
        {isSubmitted ? (
          /* ==========================================
             หน้าจอ: เมื่อกดส่งข้อมูลแล้ว (Success Screen)
             ========================================== */
          <div className="glass-card p-5 text-center reveal-section mt-5">
            <div className="mb-4" style={{ fontSize: '100px', lineHeight: '1' }}>🎊</div>
            <h1 className="fw-bolder mb-3" style={{ color: currentConfig.color }}>ส่งข้อมูลสำเร็จ!</h1>
            <p className="text-muted fs-5 mb-4">ขอบคุณที่ร่วมแบ่งปันประสบการณ์กับเรา</p>
            
            <div className="p-4 mb-4 rounded-4" style={{ backgroundColor: '#f8f9fa', border: '1px dashed #cbd5e1' }}>
              <div className="fs-5 text-muted mb-2">สรุปรีวิวของคุณ</div>
              <div className="fs-3 fw-bold mb-3" style={{ color: currentConfig.color }}>
                {rating} ดาว {currentConfig.emoji}
              </div>
              {selectedTags.length > 0 && (
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                  {selectedTags.map(t => <span key={t} className="badge bg-secondary rounded-pill px-3 py-2">{t}</span>)}
                </div>
              )}
              {comment && <div className="text-start fst-italic text-muted px-4">"{comment}"</div>}
            </div>

            <button 
              className="btn btn-light rounded-pill px-5 py-3 fw-bold text-muted shadow-sm hover-shadow w-100"
              onClick={() => { setIsSubmitted(false); setRating(0); setHover(0); setSelectedTags([]); setComment(""); }}
            >
              <i className="bi bi-arrow-counterclockwise"></i> ประเมินบริการใหม่อีกครั้ง
            </button>
          </div>
        ) : (
          /* ==========================================
             หน้าจอ: กำลังทำแบบฟอร์ม
             ========================================== */
          <>
            {/* Section 1: ส่วนให้ดาว */}
            <div className="glass-card p-5 text-center mb-4">
              <h2 className="mb-2 fw-bold text-dark">ประสบการณ์ของคุณเป็นอย่างไร?</h2>
              <p className="text-muted mb-4">แตะที่ดาวเพื่อประเมินความพึงพอใจของคุณ</p>
              
              <div className={`mb-3 ${isAnimating ? 'pop-animation' : ''}`} style={{ fontSize: '70px', transition: 'all 0.3s' }}>
                {currentConfig.emoji}
              </div>

              <div className="d-flex justify-content-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= currentValue;
                  return (
                    <span
                      key={star}
                      className="star-item"
                      style={{
                        color: isActive ? currentConfig.color : '#e2e8f0',
                        textShadow: isActive ? currentConfig.shadow : 'none',
                        transform: star <= hover ? 'scale(1.2) translateY(-8px)' : 'scale(1) translateY(0)'
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

              <h4 className="fw-bold" style={{ color: currentConfig.color, minHeight: '30px', transition: 'color 0.3s' }}>
                {currentConfig.text}
              </h4>
            </div>

            {/* Section 2: ส่วนรายละเอียด (จะโผล่มาเมื่อให้ดาวแล้วเท่านั้น) */}
            {rating > 0 && (
              <div ref={detailsRef} className="reveal-section">
                
                {/* 2.1 เลือก Tags */}
                <div className="glass-card p-4 mb-4">
                  <h5 className="fw-bold mb-3">
                    {rating >= 4 ? 'สิ่งใดที่คุณประทับใจมากที่สุด?' : 'สิ่งใดที่เราควรปรับปรุง?'} (เลือกได้มากกว่า 1)
                  </h5>
                  <div className="d-flex flex-wrap gap-2">
                    {currentTags.map(tag => (
                      <button
                        key={tag}
                        className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2.2 พิมพ์ข้อความเพิ่มเติม */}
                <div className="glass-card p-4 mb-4">
                  <h5 className="fw-bold mb-3">บอกเราเพิ่มเติมอีกนิด (ไม่บังคับ)</h5>
                  <textarea 
                    className="form-control custom-textarea p-3" 
                    rows="4" 
                    placeholder="พิมพ์ความคิดเห็น หรือข้อเสนอแนะของคุณที่นี่..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <div className="text-end text-muted mt-2" style={{ fontSize: '12px' }}>
                    {comment.length} ตัวอักษร
                  </div>
                </div>

                {/* 2.3 ปุ่ม Submit พร้อม Loading */}
                <button 
                  className="btn rounded-pill px-5 py-3 fs-5 fw-bold text-white border-0 w-100 shadow"
                  style={{ 
                    backgroundColor: currentConfig.color,
                    transition: 'all 0.3s ease',
                    opacity: isSubmitting ? 0.8 : 1
                  }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      กำลังส่งข้อมูล...
                    </>
                  ) : (
                    "ส่งข้อเสนอแนะ 🚀"
                  )}
                </button>

              </div>
            )}
          </>
        )}

      </div>
    </BootstrapLayout>
  );
}