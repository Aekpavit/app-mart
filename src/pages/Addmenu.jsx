import { useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Nav";
import { FaPlus, FaTimes, FaImage, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PiBowlFood } from "react-icons/pi";
import { LuDessert } from "react-icons/lu";
import { RiDrinks2Fill } from "react-icons/ri";

const BASE_URL = import.meta.env.VITE_API_URL;

// axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "multipart/form-data",
  }
});

const CATEGORIES = [
  { value: "food",    label: "อาหาร",      icon: <PiBowlFood />,      bg: "bg-black" },
  { value: "drink",   label: "เครื่องดื่ม", icon: <RiDrinks2Fill />,   bg: "bg-black" },
  { value: "dessert", label: "ของหวาน",     icon: <LuDessert />,       bg: "bg-black" },
];

// ─── Image Preview Modal ───────────────────────────────────────────────────────
function ImagePreviewModal({ images, currentIndex, onClose, onRemove, onNavigate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
        style={{ animation: "fadeUp .2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-50">
          <img 
            src={images[currentIndex].preview} 
            alt={`Preview ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 shadow-lg transition-all z-10"
          >
            <FaTimes size={14} />
          </button>

          {/* Remove button */}
          <button
            onClick={() => onRemove(currentIndex)}
            className="absolute top-3 left-3 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs font-bold shadow-lg transition-all z-10 flex items-center gap-2"
          >
            <FaTimes size={11} />
            ลบรูปนี้
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => onNavigate('prev')}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-black shadow-lg transition-all z-20"
              >
                <FaChevronLeft size={16} />
              </button>
              <button
                onClick={() => onNavigate('next')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-black shadow-lg transition-all z-20"
              >
                <FaChevronRight size={16} />
              </button>

              {/* Counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 text-white text-sm font-bold z-10">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AddMenu() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name_menu: "",
    price_menu: "",
    type: "food",
    des: ""
  });
  
  const [images, setImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 10) {
      setError("สามารถอัปโหลดได้สูงสุด 10 รูปภาพ");
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return newImages;
    });
    if (previewIndex === index) {
      setPreviewIndex(null);
    } else if (previewIndex > index) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const handleNavigatePreview = (direction) => {
    if (direction === 'prev') {
      setPreviewIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setPreviewIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name_menu.trim()) {
      setError("กรุณากรอกชื่อเมนู");
      return;
    }
    if (!formData.price_menu || formData.price_menu <= 0) {
      setError("กรุณากรอกราคาที่ถูกต้อง");
      return;
    }
    if (images.length === 0) {
      setError("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name_menu', formData.name_menu);
      formDataToSend.append('price_menu', formData.price_menu);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('des', formData.des);
      
      // เพิ่มรูปภาพทั้งหมด
      images.forEach((image) => {
        formDataToSend.append('images', image.file);
      });

      await apiClient.post('api/menu', formDataToSend);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/show-menu');
      }, 1500);
      
    } catch (err) {
      console.error("Submit failed:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มเมนู");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (images.length > 0 || formData.name_menu || formData.price_menu || formData.des) {
      if (window.confirm("ยกเลิกการเพิ่มเมนู? ข้อมูลที่กรอกจะหายไป")) {
        navigate('/show-menu');
      }
    } else {
      navigate('/show-menu');
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.value === formData.type);

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans text-gray-900 pb-20">
      <Navbar />

      {/* Hero */}
      <div className="pt-24 pb-6 px-4 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-1">เพิ่มเมนูใหม่</h1>
        <p className="text-sm text-gray-400">กรอกข้อมูลเมนูและอัปโหลดรูปภาพ</p>
      </div>

      {/* Form */}
      <main className="px-4 lg:px-10 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="text-red-500 text-xl">⚠️</div>
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="text-green-500 text-xl">✓</div>
              <p className="text-sm font-bold text-green-700">เพิ่มเมนูสำเร็จ! กำลังไปยังหน้ารายการเมนู...</p>
            </div>
          )}

          {/* Image Upload Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <FaImage className="text-black" />
              รูปภาพเมนู
            </h2>
            
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 10}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-black transition-all bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <FaPlus size={24} />
                  <span className="text-sm font-bold">
                    {images.length === 0 ? "คลิกเพื่ออัปโหลดรูปภาพ" : `อัปโหลดเพิ่ม (${images.length}/10)`}
                  </span>
                  <span className="text-xs text-gray-400">รองรับไฟล์ JPG, PNG (สูงสุด 10 รูป)</span>
                </div>
              </button>
            </div>

            {/* Image Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden group cursor-pointer"
                    onClick={() => setPreviewIndex(index)}
                  >
                    <img
                      src={image.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <FaTimes size={11} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded-full text-white text-[10px] font-bold">
                        หลัก
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Menu Info Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">ข้อมูลเมนู</h2>
            
            {/* Category */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">ประเภทเมนู</label>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: cat.value }))}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      formData.type === cat.value
                        ? 'bg-black text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label htmlFor="name_menu" className="block text-sm font-bold text-gray-700 mb-2">
                ชื่อเมนู <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name_menu"
                name="name_menu"
                value={formData.name_menu}
                onChange={handleInputChange}
                placeholder="เช่น ผัดไทย, ชาเย็น, ขนมเค้ก..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                required
              />
            </div>

            {/* Price */}
            <div className="mb-5">
              <label htmlFor="price_menu" className="block text-sm font-bold text-gray-700 mb-2">
                ราคา (฿) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price_menu"
                name="price_menu"
                value={formData.price_menu}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="des" className="block text-sm font-bold text-gray-700 mb-2">
                คำอธิบาย (ไม่บังคับ)
              </label>
              <textarea
                id="des"
                name="des"
                value={formData.des}
                onChange={handleInputChange}
                placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับเมนู..."
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-black focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Preview Card */}
          {(formData.name_menu || formData.price_menu || images.length > 0) && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-900 mb-4">ตัวอย่างการแสดงผล</h2>
              
              <div className="max-w-xs mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Image Preview */}
                <div className="relative w-full aspect-square bg-gray-50">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[0].preview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold">
                        <span className="text-sm">{selectedCategory.icon}</span>
                        <span>{selectedCategory.label}</span>
                      </div>
                      {images.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold">
                          +{images.length - 1}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <FaImage size={48} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {formData.name_menu || "ชื่อเมนู"}
                  </p>
                  <p className="text-sm font-black text-black mt-0.5">
                    ฿{formData.price_menu || "0.00"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-black text-sm hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading || images.length === 0}
              className="flex-1 py-4 rounded-2xl bg-black text-white font-black text-sm hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  กำลังเพิ่มเมนู...
                </>
              ) : (
                <>
                  <FaPlus size={12} />
                  เพิ่มเมนู
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Image Preview Modal */}
      {previewIndex !== null && (
        <ImagePreviewModal
          images={images}
          currentIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onRemove={removeImage}
          onNavigate={handleNavigatePreview}
        />
      )}
    </div>
  );
}