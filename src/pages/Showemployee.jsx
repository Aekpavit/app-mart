import { useEffect, useState, useRef } from "react";
import api from "/app1/app-mart/api/axios"; // Path ตามที่คุณใช้
import Navbar from "../components/Nav";
import { FaSearch, FaUserEdit, FaTrash, FaCamera, FaIdBadge } from "react-icons/fa";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function EditEmployee() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    salary: "",
    role: "",
    file: null,
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // เมื่อเลือกพนักงาน ให้เอาค่าไปใส่ใน Form
  useEffect(() => {
    if (selectedEmp) {
      setFormData({
        f_name: selectedEmp.f_name,
        l_name: selectedEmp.l_name,
        salary: selectedEmp.salary,
        role: selectedEmp.role || "",
        file: null,
      });
      setImgPreview(null);
    }
  }, [selectedEmp]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("api/employee");
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file });
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedEmp) return;
    setIsSaving(true);
  
    try {
      // ถ้ามีการอัปโหลดรูป → ใช้ FormData
      if (formData.file) {
        const data = new FormData();
        data.append("f_name", formData.f_name);
        data.append("l_name", formData.l_name);
        data.append("salary", parseFloat(formData.salary)); // แปลงเป็น number
        data.append("role", formData.role);
        data.append("img", formData.file);
  
        await api.put(`api/employee/${selectedEmp.id_em}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } 
      // ถ้าไม่มีรูป → ส่ง JSON
      else {
        await api.put(`api/employee/${selectedEmp.id_em}`, {
          f_name: formData.f_name,
          l_name: formData.l_name,
          salary: parseFloat(formData.salary), // แปลงเป็น number
          role: formData.role,
        }, {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      await fetchEmployees();
      setImgPreview(null);
      
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "อัปเดตข้อมูลพนักงานสำเร็จ",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error("Error details:", err.response?.data); // ดูรายละเอียด error
      Swal.fire("ผิดพลาด", err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedEmp) return;

    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      html: `ต้องการลบพนักงาน <b>"${selectedEmp.f_name} ${selectedEmp.l_name}"</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;
    setIsDeleting(true);

    try {
      await api.delete(`api/employee/${selectedEmp.id_em}`);
      setSelectedEmp(null);
      await fetchEmployees();
      Swal.fire("สำเร็จ", "ลบข้อมูลพนักงานเรียบร้อย", "success");
    } catch (err) {
      Swal.fire("ผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredEmp = employees.filter((item) =>
    `${item.f_name} ${item.l_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-14 min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <main className="pt-24 pb-6 px-4 lg:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          
          {/* --- ฝั่งซ้าย: รายชื่อพนักงาน --- */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-300 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อพนักงาน..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:bg-gray-200 outline-none transition-all text-sm"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </span>
              </div>
              <div className="flex justify-between items-center px-1 font-bold">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Employee List</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Total: {filteredEmp.length}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredEmp.map((emp) => (
                    <button
                      key={emp.id_em}
                      onClick={() => setSelectedEmp(emp)}
                      className={`flex items-center p-3 rounded-2xl transition-all border-2 ${
                        selectedEmp?.id_em === emp.id_em
                          ? "bg-blue-50 border-blue-500/50 shadow-md"
                          : "bg-white border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3 shrink-0">
                        <img 
                            src={emp.img ? `${BASE_URL}${emp.img}` : `https://ui-avatars.com/api/?name=${emp.f_name}`} 
                            className="w-full h-full object-cover" 
                            alt="emp" 
                        />
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="text-sm font-bold text-gray-800 truncate">{emp.f_name} {emp.l_name}</p>
                        <p className="text-[11px] text-gray-500">{emp.role} | ฿{Number(emp.salary).toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- ฝั่งขวา: ฟอร์มแก้ไข --- */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-300 overflow-hidden h-full">
            {selectedEmp ? (
              <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <FaUserEdit className="text-blue-500" /> แก้ไขข้อมูลพนักงาน
                  </h2>
                  <button onClick={() => setSelectedEmp(null)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                </div>

                <div className="flex-1 p-8 flex items-center justify-center bg-gray-50/30 overflow-y-auto">
                  <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-5 gap-10">
                    
                    {/* ส่วนรูปภาพ */}
                    <div className="md:col-span-2 flex flex-col items-center space-y-3">
                      <div
                        onClick={handleImageClick}
                        className="relative group w-48 aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-white cursor-pointer bg-white"
                      >
                        <img
                          src={imgPreview || (selectedEmp.img ? `${BASE_URL}${selectedEmp.img}` : `https://ui-avatars.com/api/?name=${selectedEmp.f_name}+${selectedEmp.l_name}&size=200`)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          alt="preview"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                          <FaCamera className="text-3xl mb-1" />
                          <span className="text-[10px] font-bold uppercase">Change Photo</span>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      </div>
                      <div className="text-center">
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-[10px] font-black text-gray-600 uppercase">
                           Employee ID: {selectedEmp.id_em}
                        </span>
                      </div>
                    </div>

                    {/* ส่วน Input ข้อมูล */}
                    <div className="md:col-span-3 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-gray-400 uppercase ml-1">ชื่อ (First Name)</label>
                          <input type="text" value={formData.f_name} onChange={(e) => setFormData({...formData, f_name: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-black text-gray-400 uppercase ml-1">นามสกุล (Last Name)</label>
                          <input type="text" value={formData.l_name} onChange={(e) => setFormData({...formData, l_name: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none font-bold" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1">ตำแหน่ง (Role)</label>
                        <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none font-bold text-blue-600" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 uppercase ml-1">เงินเดือน (Salary)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">฿</span>
                          <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-blue-500 outline-none font-bold text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ปุ่มจัดการ */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white px-8 shrink-0">
                  <button onClick={handleDelete} disabled={isDeleting}
                    className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-500 hover:text-white disabled:bg-gray-100 transition-all flex items-center gap-2 border border-red-100"
                  >
                    <FaTrash /> {isDeleting ? "กำลังลบ..." : "ลบพนักงาน"}
                  </button>
                  <button onClick={handleSave} disabled={isSaving}
                    className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                  >
                    {isSaving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
                <FaIdBadge className="text-8xl mb-4 text-gray-200" />
                <p className="text-gray-400 font-bold">เลือกพนักงานจากรายการด้านซ้ายเพื่อดูรายละเอียด</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}</style>
    </div>
  );
}