import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { Head } from "@inertiajs/react";
import { useState, useRef } from "react";

// ชุดข้อความที่ดูเป็นทางการและมืออาชีพมากขึ้น
const ratingConfig = {
  0: { text: "กรุณาให้คะแนนความพึงพอใจ", color: "#64748b", icon: "bi-star" },
  1: { text: "ผิดหวังมาก ต้องปรับปรุง", color: "#ef4444", icon: "bi-emoji-frown" },
  2: { text: "ค่อนข้างแย่ มีข้อบกพร่อง", color: "#f97316", icon: "bi-emoji-expressionless" },
  3: { text: "ปานกลาง ตามมาตรฐาน", color: "#eab308", icon: "bi-emoji-neutral" },
  4: { text: "ดี ประทับใจ", color: "#22c55e", icon: "bi-emoji-smile" },
  5: { text: "ยอดเยี่ยมมาก!", color: "#3b82f6", icon: "bi-emoji-heart-eyes" }
};

const positiveTags = ["บริการรวดเร็ว", "พนักงานสุภาพ", "คุ้มค่าราคา", "สถานที่สะอาด", "ให้คำแนะนำดี"];
const negativeTags = ["รอนานเกินไป", "พนักงานบริการไม่ดี", "ราคาแพงเกินไป", "สถานที่แคบ/ไม่สะอาด", "ระบบมีปัญหา"];

export default function Quiz3() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  
  // ฟีเจอร์ที่เพิ่มเข้ามาใหม่
  const [serviceBranch, setServiceBranch] = useState("");
  const [recommend, setRecommend] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const detailsRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentValue = hover || rating;
  const currentConfig = ratingConfig[currentValue];

  const handleRatingClick = (star) => {
    setRating(star);
    setSelectedTags([]); 
    
    // Auto-scroll ลงมาส่วนฟอร์มอย่างนุ่มนวล
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // จำลองการอัปโหลดไฟล์
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file.name);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    // จำลองการส่ง API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const currentTags = rating >= 4 ? positiveTags : negativeTags;

  return (
    <BootstrapLayout>
      <Head title="Customer Feedback" />
      
      <style>{`
        body { background-color: #f1f5f9; font-family: 'Prompt', sans-serif; }
        .pro-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .star-item {
          font-size: 45px;
          cursor: pointer;
          color: #cbd5e1;
          transition: all 0.2s ease;
          line-height: 1;
        }
        .star-item.active {
          color: #f59e0b;
        }
        .star-item:hover { transform: scale(1.15); }
        .tag-btn {
          border: 1px solid #cbd5e1;
          background: transparent;
          color: #475569;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 14px;
          transition: all 0.2s;
        }
        .tag-btn:hover { background: #f8fafc; }
        .tag-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 500;
        }
        .upload-box {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }
        .upload-box:hover { border-color: #3b82f6; background: #f8fafc; }
        .form-select, .form-control { border-radius: 8px; border-color: #cbd5e1; }
        .form-control:focus, .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .recommend-btn {
          border: 1px solid #cbd5e1;
          background: white;
          border-radius: 8px;
          color: #475569;
        }
        .recommend-btn.active-yes { background: #dcfce7; border-color: #22c55e; color: #166534; }
        .recommend-btn.active-no { background: #fee2e2; border-color: #ef4444; color: #991b1b; }
      `}</style>

      <div className="container py-5" style={{ maxWidth: '650px' }}>
        
        {isSubmitted ? (
          /* ==========================================
             หน้า Success (ดีไซน์แบบแอปส่งอาหาร)
             ========================================== */
          <div className="pro-card p-5 text-center mt-4">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill" style={{ fontSize: '80px', color: '#22c55e' }}></i>
            </div>
            <h2 className="fw-bold text-dark mb-2">ได้รับข้อเสนอแนะแล้ว</h2>
            <p className="text-muted mb-4">ขอบคุณที่สละเวลา ข้อมูลของคุณจะช่วยเราพัฒนาให้ดียิ่งขึ้น</p>
            
            <div className="bg-light p-4 rounded-3 text-start mb-4">
              <p className="mb-2"><strong>สาขา/บริการ:</strong> {serviceBranch || "ไม่ระบุ"}</p>
              <p className="mb-2"><strong>คะแนน:</strong> {rating} / 5 ดาว</p>
              {selectedTags.length > 0 && (
                <p className="mb-2"><strong>สิ่งที่พบ:</strong> {selectedTags.join(", ")}</p>
              )}
              {imageFile && <p className="mb-2"><strong>รูปภาพแนบ:</strong> <i className="bi bi-image"></i> {imageFile}</p>}
            </div>

            <button 
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => window.location.reload()}
            >
              กลับสู่หน้าหลัก
            </button>
          </div>
        ) : (
          /* ==========================================
             หน้าฟอร์มรีวิว
             ========================================== */
          <>
            <div className="mb-4 text-center">
              <h2 className="fw-bold text-dark">ประเมินความพึงพอใจ</h2>
              <p className="text-muted">ความพึงพอใจของคุณคือสิ่งสำคัญสำหรับเรา</p>
            </div>

            {/* ส่วนที่ 1: ข้อมูลเบื้องต้น */}
            <div className="pro-card p-4 mb-4">
              <label className="form-label fw-bold">1. บริการที่คุณต้องการรีวิว <span className="text-danger">*</span></label>
              <select 
                className="form-select mb-4" 
                value={serviceBranch}
                onChange={(e) => setServiceBranch(e.target.value)}
              >
                <option value="">-- กรุณาเลือกสาขาหรือประเภทบริการ --</option>
                <option value="สั่งซื้อออนไลน์ (Website)">สั่งซื้อออนไลน์ (Website)</option>
                <option value="บริการหน้าร้าน (สาขาหลัก)">บริการหน้าร้าน (สาขาหลัก)</option>
                <option value="ติดต่อแจ้งปัญหา (Support)">ติดต่อแจ้งปัญหา (Support)</option>
                <option value="บริการจัดส่งสินค้า">บริการจัดส่งสินค้า</option>
              </select>

              <label className="form-label fw-bold">2. คุณพึงพอใจแค่ไหน? <span className="text-danger">*</span></label>
              <div className="d-flex flex-column align-items-center mt-2">
                <div className="d-flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi bi-star-fill star-item ${star <= currentValue ? 'active' : ''}`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    ></i>
                  ))}
                </div>
                
                <div className="d-flex align-items-center gap-2 mt-2" style={{ height: '24px' }}>
                  {currentValue > 0 && (
                    <>
                      <i className={`bi ${currentConfig.icon} fs-5`} style={{ color: currentConfig.color }}></i>
                      <span className="fw-medium" style={{ color: currentConfig.color }}>{currentConfig.text}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ส่วนที่ 2: รายละเอียด (แสดงเมื่อให้ดาวแล้ว) */}
            {rating > 0 && (
              <div ref={detailsRef} style={{ animation: 'fadeIn 0.5s ease' }}>
                
                <div className="pro-card p-4 mb-4">
                  <label className="form-label fw-bold">
                    {rating >= 4 ? 'สิ่งที่คุณประทับใจ (เลือกได้หลายข้อ)' : 'สิ่งที่เราควรปรับปรุง (เลือกได้หลายข้อ)'}
                  </label>
                  <div className="d-flex flex-wrap gap-2 mb-4">
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

                  <label className="form-label fw-bold">ข้อเสนอแนะเพิ่มเติม</label>
                  <textarea 
                    className="form-control mb-3" 
                    rows="3" 
                    placeholder="อธิบายเพิ่มเติมเกี่ยวกับประสบการณ์ของคุณ..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>

                  {/* ฟีเจอร์แนบรูปภาพ */}
                  <label className="form-label fw-bold mt-2">แนบรูปภาพประกอบ (ถ้ามี)</label>
                  <div 
                    className="upload-box"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {imageFile ? (
                      <div className="text-primary fw-medium">
                        <i className="bi bi-file-image me-2"></i> {imageFile}
                        <span className="text-muted ms-2" style={{fontSize: '12px'}}>(คลิกเพื่อเปลี่ยนรูป)</span>
                      </div>
                    ) : (
                      <div>
                        <i className="bi bi-cloud-arrow-up fs-3 mb-2 d-block"></i>
                        คลิกเพื่ออัปโหลดรูปภาพ (สูงสุด 5MB)
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="d-none" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {/* ฟีเจอร์ แนะนำเพื่อน */}
                <div className="pro-card p-4 mb-4 text-center">
                  <label className="form-label fw-bold mb-3">คุณจะแนะนำบริการของเราให้เพื่อนหรือคนรู้จักหรือไม่?</label>
                  <div className="d-flex justify-content-center gap-3">
                    <button 
                      className={`btn recommend-btn px-4 py-2 ${recommend === true ? 'active-yes' : ''}`}
                      onClick={() => setRecommend(true)}
                    >
                      <i className="bi bi-hand-thumbs-up me-2"></i> แนะนำแน่นอน
                    </button>
                    <button 
                      className={`btn recommend-btn px-4 py-2 ${recommend === false ? 'active-no' : ''}`}
                      onClick={() => setRecommend(false)}
                    >
                      <i className="bi bi-hand-thumbs-down me-2"></i> ไม่แนะนำ
                    </button>
                  </div>
                </div>

                {/* ปุ่ม Submit */}
                <button 
                  className="btn btn-primary rounded-8 px-5 py-3 fs-6 fw-bold w-100 shadow-sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !serviceBranch}
                >
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span> กำลังส่งข้อมูล...</>
                  ) : (
                    "ส่งข้อเสนอแนะ"
                  )}
                </button>
                {!serviceBranch && <p className="text-danger text-center mt-2" style={{fontSize: '13px'}}>* กรุณาเลือกบริการที่คุณต้องการรีวิวด้านบนก่อน</p>}

              </div>
            )}
          </>
        )}

      </div>
    </BootstrapLayout>
  );
}