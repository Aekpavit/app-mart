import { useEffect, useState, useRef } from "react";
import api from "/app1/app-mart/api/axios";
import Navbar from "../components/Nav";
import { FaSearch, FaCamera } from "react-icons/fa";
import { useContext } from "react";
import { MenuContext } from "../context/MenuContext";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function EditMenu() {
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", file: null });
  const [imgPreview, setImgPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { setMenuCount } = useContext(MenuContext);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (selectedMenu) {
      setFormData({
        name: selectedMenu.name_menu,
        price: selectedMenu.price_menu,
        file: null
      });
      setImgPreview(null);
    }
  }, [selectedMenu]);

  const fetchMenu = async () => {
    try {
      const res = await api.get("api/menu");
      setMenus(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file });
      const objectUrl = URL.createObjectURL(file);
      setImgPreview(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!selectedMenu) return;
  
    setIsSaving(true);
  
    try {
      if (formData.file) {

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("image", formData.file);
  
        await api.put(`api/menu/${selectedMenu.id_menu}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
  
      } else {
        // 🔥 ไม่มีรูปใหม่ → ส่ง JSON ปกติ
        await api.put(`api/menu/${selectedMenu.id_menu}`, {
          name: formData.name,
          price: formData.price
        });
      }
  
      alert("บันทึกสำเร็จ 🔥");
      fetchMenu(); // รีโหลดรายการใหม่
  
    } catch (err) {
      console.error("Update failed", err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsSaving(false);
    }
  };
  

  const handleDelete = async () => {
    if (!selectedMenu) return;
    if (!confirm(`คุณต้องการลบเมนู "${selectedMenu.name_menu}" ใช่หรือไม่?`)) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMenus(menus.filter((m) => m.id_menu !== selectedMenu.id_menu));
      setSelectedMenu(null);
      alert("ลบข้อมูลสำเร็จ");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredMenu = menus.filter((item) =>
    item.name_menu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-14 min-h-screen bg-gray-50 font-sans text-gray-900 ">
      <Navbar />

      <main className="pt-24 pb-6 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          
          {/* Left Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-300 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="ค้นหาเมนู"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-200 rounded-xl focus:bg-gray-300 outline-none transition-all text-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaSearch /></span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-gray-400 pl-3 uppercase">Menu List</span>
                <span className="text-[10px]  text-gray-600 bg-blue-50 px-3 py-0.5 rounded-md">จำนวนเมนู: {filteredMenu.length}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {filteredMenu.map((item) => (
                    <button
                      key={item.id_menu}
                      onClick={() => setSelectedMenu(item)}
                      className={`flex flex-col items-center p-1.5 rounded-xl transition-all border-2 ${
                        selectedMenu?.id_menu === item.id_menu
                          ? "bg-blue-50 border-blue-500/50 shadow-3xl"
                          : "bg-white border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-1">
                        <img src={`${BASE_URL}${item.img}`} className="w-full h-full object-scale-down" alt="menu" />
                      </div>
                      <p className="text-[9px] font-bold text-gray-800 truncate w-full text-center">{item.name_menu}</p>
                      <p className="text-[9px] font-medium text-gray-600">฿{item.price_menu}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-300 overflow-hidden h-full">
            {selectedMenu ? (
              <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 leading-none">แก้ไขข้อมูล</h2>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">ID: {selectedMenu.id_menu}</p>
                  </div>
                  <button onClick={() => setSelectedMenu(null)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                </div>

                <div className="flex-1 p-6 flex items-center justify-center overflow-hidden bg-gray-50/30">
                  <div className="w-full max-w-2xl grid grid-cols-5 gap-8 items-center">
                    
                    {/* --- ส่วนรูปภาพ --- */}
                    <div className="col-span-2 space-y-2">
                      <div 
                        onClick={handleImageClick}
                        className="relative group aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white cursor-pointer bg-gray-100"
                      >
                        <img 
                          src={imgPreview || `${BASE_URL}${selectedMenu.img}`} 
                          className="w-full h-full object-scale-down transition-all duration-500 group-hover:blur-sm group-hover:scale-110" 
                          alt="preview" 
                        />
                        
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                          <FaCamera className="text-3xl mb-1 drop-shadow-md" />
                          <span className="text-xs font-bold drop-shadow-md">เปลี่ยนรูป</span>
                        </div>

                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden" 
                        />
                      </div>
                      <p className="text-[10px] text-center text-gray-400 font-bold animate-pulse ">คลิกที่รูปเพื่อเปลี่ยน</p>
                    </div>

                    <div className="col-span-3 space-y-5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1">ชื่อรายการอาหาร</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1">ราคา (บาท)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">฿</span>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end items-center shrink-0 bg-white px-8">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                  >
                    {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="text-5xl mb-4 opacity-20 animate-bounce" >?</div>
                <p className="text-gray-400 font-bold">เลือกเมนูจากด้านซ้ายเพื่อแก้ไข</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}