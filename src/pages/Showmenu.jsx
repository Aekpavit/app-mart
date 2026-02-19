import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Nav";
import { FaSearch, FaEdit, FaTimes, FaFire, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PiBowlFood } from "react-icons/pi";
import { LuDessert } from "react-icons/lu";
import { RiDrinks2Fill } from "react-icons/ri";

const BASE_URL = import.meta.env.VITE_API_URL;

//axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

const CATEGORIES = [
  { value: "food",    label: "อาหาร",      icon: <PiBowlFood />,      bg: "bg-black", iconColor: "text-white" },
  { value: "drink",   label: "เครื่องดื่ม", icon: <RiDrinks2Fill />,   bg: "bg-black", iconColor: "text-white" },
  { value: "dessert", label: "ของหวาน",     icon: <LuDessert />,       bg: "bg-black", iconColor: "text-white" },
];

const getCat = (type) =>
  CATEGORIES.find((c) => c.value === type) ?? CATEGORIES[0];

// ─── Modal ─────────────────────────────────────────────────────────────────────
function MenuModal({ item, onClose, onEdit }) {
  const cat = getCat(item.type);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // ถ้า item.img เป็น array ให้ใช้, ถ้าไม่ใช่ให้ทำเป็น array
  const images = Array.isArray(item.img) ? item.img : [item.img];

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "fadeUp .2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* image */}
        <div className="relative w-full aspect-square bg-gray-50">
          <img 
            src={`${BASE_URL}${images[currentImageIndex]}`} 
            alt={item.name_menu} 
            className="w-full h-full object-contain transition-all duration-300"
          />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 shadow-md transition-all z-10"
          >
            <FaTimes size={11} />
          </button>

          {/* Category badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-bold z-10">
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.label}</span>
          </div>

          {/* Image navigation buttons - แสดงเฉพาะเมื่อมีรูปหลายรูป */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-black shadow-lg transition-all z-20 pointer-events-auto active:scale-95"
                aria-label="รูปภาพก่อนหน้า"
              >
                <FaChevronLeft size={14} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-black shadow-lg transition-all z-20 pointer-events-auto active:scale-95"
                aria-label="รูปภาพถัดไป"
              >
                <FaChevronRight size={14} />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-bold z-10 pointer-events-none">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Image indicator dots */}
              <div className="absolute bottom-3 right-3 flex gap-1 z-10 pointer-events-none">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? "w-5 bg-white" : "w-2 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-xl font-black text-gray-900">{item.name_menu}</h2>
            <p className="text-2xl font-black text-black shrink-0">฿{item.price_menu}</p>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">ID: {item.id_menu}</p>
          {item.des && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.des}</p>}

          <button
            onClick={() => onEdit(item)}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-black text-white font-black text-sm hover:bg-gray-800 active:scale-95 transition-all"
          >
            <FaEdit size={13} />
            ไปที่หน้าแก้ไข
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────
function MenuCard({ item, onClick }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const images = Array.isArray(item.img) ? item.img : [item.img];

  const handlePrevClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = () => {
    onClick(item);
  };

  return (
    <button
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 overflow-hidden text-left active:scale-95"
    >
      {/* Image section with navigation */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <img
          src={`${BASE_URL}${images[imageIndex]}`}
          alt={item.name_menu}
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isHovering ? "scale-105" : "scale-100"
          }`}
          draggable="false"
        />

        {/* Navigation buttons - แสดงเมื่อ hover และมีรูปหลายรูป */}
        {images.length > 1 && isHovering && (
          <>
            <button
              onClick={handlePrevClick}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-black shadow-md transition-all z-20 pointer-events-auto active:scale-95"
              aria-label="รูปภาพก่อนหน้า"
            >
              <FaChevronLeft size={11} />
            </button>
            <button
              onClick={handleNextClick}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-black shadow-md transition-all z-20 pointer-events-auto active:scale-95"
              aria-label="รูปภาพถัดไป"
            >
              <FaChevronRight size={11} />
            </button>

            {/* Image counter - แสดงเมื่อ hover */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-black/70 text-white text-[10px] font-bold z-10 pointer-events-none">
              {imageIndex + 1}/{images.length}
            </div>
          </>
        )}
      </div>

      {/* Info section */}
      <div className="p-3">
        <p className="text-xs font-bold text-gray-800 truncate">{item.name_menu}</p>
        <p className="text-sm font-black text-black mt-0.5">฿{item.price_menu}</p>
      </div>
    </button>
  );
}

// ─── Category Section ──────────────────────────────────────────────────────────
function CategorySection({ category, items, onCardClick }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 210, behavior: "smooth" });
    }
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white text-lg shadow">
          {category.icon}
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-900 leading-none">{category.label}</h2>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">{items.length} รายการ</p>
        </div>
      </div>

      {/* Cards row with scroll control */}
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <MenuCard key={item.id_menu} item={item} onClick={onCardClick} />
          ))}
        </div>

        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center text-white shadow-lg transition-all z-10 pointer-events-auto active:scale-95"
            aria-label="เลื่อนซ้าย"
          >
            <FaChevronLeft size={15} />
          </button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center text-white shadow-lg transition-all z-10 pointer-events-auto active:scale-95"
            aria-label="เลื่อนขวา"
          >
            <FaChevronRight size={15} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mt-10 border-b border-gray-100" />
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ShowMenu() {
  const [menus, setMenus]       = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [focused, setFocused]   = useState(false);
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();
  const inputRef                = useRef(null);

  useEffect(() => { 
    fetchMenu(); 
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ใช้ axios สำหรับเรียก API
      const response = await apiClient.get("api/menu");
      
      setMenus(response.data);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("ไม่สามารถโหลดข้อมูลเมนูได้");
    } finally {
      setLoading(false);
    }
  };

  const filtered = menus.filter((item) =>
    item.name_menu.toLowerCase().includes(search.toLowerCase())
  );

  const CATEGORIES_LOCAL = CATEGORIES;
  const grouped = CATEGORIES_LOCAL.map((cat) => ({
    category: cat,
    items: filtered.filter((item) => item.type === cat.value),
  }));

  const isSearching = search.trim().length > 0;

  const handleEdit = (item) => {
    setSelected(null);
    navigate("/menu", { state: { menuId: item.id_menu } });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans text-gray-900">
      <Navbar />

      {/* ── Hero + Search ── */}
      <div className="pt-24 pb-10 px-4 flex flex-col items-center text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-1">เมนูทั้งหมด</h1>
        <p className="text-sm text-gray-400 mb-8">
          {menus.length} รายการ · {CATEGORIES_LOCAL.length} ประเภท
        </p>

        {/* Search */}
        <div className={`relative w-full max-w-lg transition-all duration-300 ${focused ? "scale-[1.02]" : ""}`}>
          <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors ${focused ? "text-black" : "text-gray-400"}`} />
          <input
            ref={inputRef}
            type="text"
            placeholder="ค้นหาเมนู เช่น ผัดไทย, ชาเย็น..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full pl-11 pr-10 py-4 bg-white rounded-2xl text-sm font-medium outline-none transition-all border ${
              focused ? "border-black shadow-md" : "border-gray-200 shadow-sm"
            }`}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xl leading-none transition-colors"
            >×</button>
          )}
        </div>

        {isSearching && (
          <p className="text-xs text-gray-400 mt-3">
            พบ <span className="font-bold text-gray-800">{filtered.length}</span> รายการ สำหรับ "
            <span className="font-bold text-black">{search}</span>"
          </p>
        )}
      </div>

      {/* ── Content ── */}
      <main className="pb-16 px-4 lg:px-10 max-w-[1400px] mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>

        ) : error ? (
          <div className="flex flex-col items-center py-24 text-gray-400">
            <div className="text-6xl mb-4 opacity-20">⚠️</div>
            <p className="font-bold text-gray-500">{error}</p>
            <button 
              onClick={() => fetchMenu()} 
              className="mt-3 text-xs text-black hover:underline font-bold"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>

        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-gray-400">
            <div className="text-6xl mb-4 opacity-20">🍽️</div>
            <p className="font-bold text-gray-500">ไม่พบเมนูที่ค้นหา</p>
            <button onClick={() => setSearch("")} className="mt-3 text-xs text-black hover:underline font-bold">
              ล้างการค้นหา
            </button>
          </div>

        ) : isSearching ? (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <FaFire className="text-orange-400" />
              <span className="text-sm font-black text-gray-700">ผลการค้นหา</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {filtered.map((item) => (
                <MenuCard key={item.id_menu} item={item} onClick={setSelected} />
              ))}
            </div>
          </div>

        ) : (
          grouped.map(({ category, items }) => (
            <CategorySection
              key={category.value}
              category={category}
              items={items}
              onCardClick={setSelected}
            />
          ))
        )}
      </main>

      {selected && (
        <MenuModal item={selected} onClose={() => setSelected(null)} onEdit={handleEdit} />
      )}

      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}