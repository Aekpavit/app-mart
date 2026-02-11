import { useEffect, useState } from "react";
import api from "/app1/app-mart/api/axios";
import Navbar from "../components/Nav";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function EditMenu() {
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenus(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลไม่สำเร็จ", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenu = menus.filter((item) =>
    item.name_menu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <div className="pt-28 pb-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            {/* Search Input */}
            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="ค้นหาเมนู..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border-none shadow-sm shadow-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* ฝั่งซ้าย: รายการเมนู */}
            <div className="lg:col-span-5 space-y-3 max-h-[65vh] overflow-y-auto pr-3 custom-scrollbar-minimal">
              <div className="flex justify-between items-center px-2 mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">List Items</span>
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">{filteredMenu.length} รายการ</span>
              </div>

              {filteredMenu.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
                  <p className="text-slate-400 font-medium">ไม่พบข้อมูลที่ค้นหา</p>
                </div>
              ) : (
                filteredMenu.map((item) => (
                  <div 
                    key={item.id_menu}
                    onClick={() => setSelectedMenu(item)}
                    className={`group flex items-center gap-4 bg-white p-3 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                      selectedMenu?.id_menu === item.id_menu 
                      ? 'border-indigo-500 shadow-xl shadow-indigo-100 scale-[1.01]' 
                      : 'border-transparent hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-50">
                      <img src={`${BASE_URL}${item.img}`} className="h-full w-full object-cover" alt={item.name_menu} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">{item.name_menu}</h3>
                      <p className="text-indigo-600 font-black text-sm">฿{item.price_menu}</p>
                    </div>
                    <div className={`transition-all duration-300 ${selectedMenu?.id_menu === item.id_menu ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                       <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ฝั่งขวา: แบบฟอร์มแก้ไข */}
            <div className="lg:col-span-7 sticky top-28">
              {selectedMenu ? (
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <div className="p-8 md:p-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">รายละเอียดเมนู</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Editing Mode</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedMenu(null)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Image Editor UI */}
                      <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="h-32 w-32 shrink-0 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                          <img src={`${BASE_URL}${selectedMenu.img}`} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div className="text-center sm:text-left">
                          <h4 className="font-bold text-slate-700 mb-1">รูปภาพเมนู</h4>
                          <p className="text-xs text-slate-400 mb-4 px-2 sm:px-0">แนะนำขนาด 800x800px (ไม่เกิน 2MB)</p>
                          <button className="px-6 py-2 bg-white text-indigo-600 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100">
                            อัปโหลดใหม่
                          </button>
                        </div>
                      </div>

                      {/* Input Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 ml-1 uppercase">ชื่อเมนูอาหาร</label>
                          <input 
                            type="text" 
                            defaultValue={selectedMenu.name_menu}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 ml-1 uppercase">ราคา (บาท)</label>
                          <input 
                            type="number" 
                            defaultValue={selectedMenu.price_menu}
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold text-indigo-600"
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-indigo-100 active:scale-95">
                          อัปเดตข้อมูลเมนู
                        </button>
                        <button className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-95">
                          ลบรายการนี้
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[500px] bg-white/40 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                    <svg className="h-10 w-10 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-500">พร้อมแก้ไขเมนูของคุณหรือยัง?</h3>
                  <p className="text-sm">เลือกรายการเมนูทางซ้ายเพื่อเริ่มแก้ไขข้อมูล</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar-minimal::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-minimal::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-minimal::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
        .custom-scrollbar-minimal::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}} />
    </div>
  );
}