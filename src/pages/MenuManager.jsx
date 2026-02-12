import { useEffect, useState } from "react";
import api from "/app1/app-mart/api/axios";
import Navbar from "../components/Nav";
import { FaSearch } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function EditMenu() {
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (selectedMenu) {
      setFormData({
        name: selectedMenu.name_menu,
        price: selectedMenu.price_menu,
      });
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

  const handleSave = async () => {
    if (!selectedMenu) return;
    setIsSaving(true);
    try {
      // TODO: Implement actual update API
      console.log("Saving ID:", selectedMenu.id_menu, formData);
      await new Promise((resolve) => setTimeout(resolve, 800)); 
      alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (err) {
      console.error("Save failed", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMenu) return;
    if (!confirm(`คุณต้องการลบเมนู "${selectedMenu.name_menu}" ใช่หรือไม่?`)) return;
    try {
      // TODO: Implement actual delete API
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMenus(menus.filter((m) => m.id_menu !== selectedMenu.id_menu));
      setSelectedMenu(null);
      alert("ลบข้อมูลสำเร็จ");
    } catch (err) {
      console.error("Delete failed", err);
      alert("ไม่สามารถลบข้อมูลได้");
    }
  };

  const filteredMenu = menus.filter((item) =>
    item.name_menu.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-14 min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="pt-24 pb-6 px-4 lg:px-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          
          {/* Left Panel: Menu List (เลื่อนได้ปกติ) */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-300/90 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อเมนู..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-36 pr-4 py-2.5 bg-gray-200 border-blue-500 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-gray-300 outline-none transition-all"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{<FaSearch />}</span>
              </div>
            </div>
            <div className="text-sm font-medium text-stone-500 bg-blue-50 px-3 py-1 rounded-full ml-72">
            ทั้งหมด {menus.length} รายการ
          </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium">กำลังดึงข้อมูล...</p>
                </div>
              ) : filteredMenu.map((item) => (
                <button
                  key={item.id_menu}
                  onClick={() => setSelectedMenu(item)}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all border-2 ${
                    selectedMenu?.id_menu === item.id_menu
                      ? " bg-black/10 border-stone-500/50 shadow-md shadow-blue-50"
                      : "bg-white border-transparent hover:border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <img 
                    src={`${BASE_URL}${item.img}`} 
                    className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0" 
                    alt={item.name_menu}
                  />
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.name_menu}</p>
                    <p className="text-sm text-gray-600/60 ">฿{item.price_menu}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Edit Form (ไม่เลื่อน ทุกอย่างพอดีหน้าจอเดียว) */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-300 overflow-hidden h-full">
            {selectedMenu ? (
              <div className="h-full flex flex-col">
                {/* Fixed Form Header - Compact */}
                <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">แก้ไขข้อมูลรายการ</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Menu ID: {selectedMenu.id_menu}</p>
                  </div>
                  <button onClick={() => setSelectedMenu(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-red-600 transition-colors">✕</button>
                </div>

                {/* Form Body: ไม่มี scroll, ทุกอย่างอยู่ในหน้าจอเดียว */}
                <div className="flex-1 p-6 flex items-center justify-center overflow-hidden">
                  <div className="w-full max-w-2xl grid grid-cols-3 gap-6 items-start">
                    
                    {/* Image Area - ย่อลง */}
                    <div className="col-span-1 space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">รูปภาพ</label>
                      <div className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-gray-300/70">
                        <img 
                          src={`${BASE_URL}${selectedMenu.img}`} 
                          className="w-full h-full object-cover transition duration-300 group-hover:blur-sm group-hover:scale-105" 
                          alt="preview"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <button className="bg-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-xl">เปลี่ยน</button>
                        </div>
                      </div>
                    </div>

                    {/* Inputs Area - ย่อลง */}
                    <div className="col-span-2 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">ชื่อรายการอาหาร</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">ราคาขาย (บาท)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">฿</span>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-sky-500-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Form Footer - Compact */}
                <div className="p-4 border-t border-gray-100 flex justify-center items-center shrink-0 bg-gray-50/50">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-300 transition-all text-sm"
                  >
                    {isSaving ? "กำลังบันทึก..." : "ยืนยันการแก้ไข"}
                  </button>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50/30">
                <div className="w-24 h-24 text-gray-500/60 bg-white shadow-xl shadow-gray-200/50 rounded-[40px] flex items-center justify-center mb-6 text-6xl animate-pulse">?</div>
                <p className="text-gray-500 max-w-xs font-medium">เลือกรายการอาหารจากแถบด้านซ้าย เพื่อเริ่มต้นปรับแต่งข้อมูลเมนูของคุณ</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}