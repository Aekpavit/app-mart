import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Nav";
import { VscGraph } from "react-icons/vsc";
import {
  MdOutlineAttachMoney,
  MdOutlineMenuBook,
  MdContentPasteSearch,
  MdOutlineRestaurantMenu,
} from "react-icons/md";
import { BsCalendar2Check } from "react-icons/bs";
import Footer from "../components/Footer";
import { MenuContext } from "../context/MenuContext";

export default function Home() {
  const navigate = useNavigate();
  const { menuCount } = useContext(MenuContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900">
      <Navbar />

      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="mt-16 mb-10 flex flex-col items-center">
          <h1 className="text-2xl text-gray-600 font-bold ">
            สวัสดีuserยินดีต้อนรับ !!
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 ">
          <StatCard
            title="ยอดขายวันนี้"
            value="0"
            icon={<MdOutlineAttachMoney />}
            className="from-emerald-500 to-emerald-600"
          />
          <StatCard
            title="ออเดอร์ทั้งหมด"
            value="0"
            icon={<BsCalendar2Check />}
            className="from-blue-600 to-blue-700"
          />
          <StatCard
            title="เมนูทั้งหมด"
            value={menuCount}
            icon={<MdOutlineMenuBook />}
            className="from-purple-600 to-purple-700"
            onClick={() => navigate("/showmenu")}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-400/40 overflow-hidden">
            <div className="p-6 border-b border-gray-300 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                ออเดอร์ล่าสุด
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 transition font-medium">
                ดูทั้งหมด
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-700 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">รายการอาหาร</th>
                    <th className="px-6 py-4 font-semibold">เวลา</th>
                    <th className="px-6 py-4 font-semibold">ราคา</th>
                    <th className="px-6 py-4 font-semibold">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <OrderRow
                    name="ข้าวกะเพราหมูกรอบ"
                    time="10:20"
                    price="฿75"
                    status="เสร็จสิ้น"
                    statusColor="bg-emerald-100 text-emerald-700"
                  />
                  <OrderRow
                    name="ตำปูปลาร้า"
                    time="10:15"
                    price="฿60"
                    status="กำลังปรุง"
                    statusColor="bg-blue-100 text-blue-700"
                  />
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-400/40">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                <MdContentPasteSearch className="text-stone-600" />{" "}
                ทางลัดจัดการร้าน
              </h3>

              <div className="grid gap-3">
                <button
                  onClick={() => navigate("/addmenu")}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition text-sm font-medium shadow-sm"
                >
                  เพิ่มเมนูใหม่
                </button>

                <button
                  onClick={() => navigate("/menu")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-800 text-white rounded-lg transition text-sm font-medium shadow-sm"
                >
                  แก้ไขเมนู
                </button>

                <button className="w-full py-3 bg-yellow-700/60 hover:bg-yellow-700/70 text-white rounded-lg transition text-sm font-medium">
                  จัดการระบบร้าน
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function StatCard({ title, value, icon, className, onClick }) {
  const content = (
    <div
      className={`bg-gradient-to-br ${className} p-6 rounded-2xl text-white`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium opacity-90">{title}</p>
        <span className="text-xl bg-white/20 p-2 rounded-md">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold mt-4">{value}</h3>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition shadow-sm hover:shadow-md cursor-pointer hover:shadow-2xl active:scale-95 w-full text-left"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition shadow-sm hover:shadow-md">
      {content}
    </div>
  );
}
function OrderRow({ name, time, price, status, statusColor }) {
  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-medium text-gray-900">{name}</td>
      <td className="px-6 py-4 text-gray-600 text-sm">{time} น.</td>
      <td className="px-6 py-4 font-semibold text-gray-900">{price}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
