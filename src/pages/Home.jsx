import React from "react";
import Navbar from "../components/Nav";
import { VscGraph } from "react-icons/vsc";
import {
  MdOutlineAttachMoney,
  MdBorderColor,
  MdMoreTime,
} from "react-icons/md";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="mt-16 mb-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-2xl font-extrabold text-slate-500 hover:scale-105 hover:text-emerald-500 transition duration-500 cursor-default">
            ยินดีต้อนรับกลับมา! นี่คือภาพรวมร้านค้าของคุณวันนี้
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-10">
          <StatCard
            title="ยอดขายวันนี้"
            value="0"
            icon={<MdOutlineAttachMoney />}
            className="from-emerald-400 to-teal-500"
            trend="none"
          />
          <StatCard
            title="ออเดอร์ทั้งหมด"
            value="0"
            icon={<MdBorderColor />}
            className="from-blue-400 to-indigo-500"
            trend="none"
          />
          <StatCard
            title="เมนูทั้งหมด"
            value="0"
            icon={<VscGraph />}
            className="from-orange-400 to-pink-500"
            trend="none"
          />
        </div>

        {/* Main Content: Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                ออเดอร์ล่าสุด
              </h2>
              <button className="text-sm text-emerald-600 font-semibold hover:bg-emerald-50 px-3 py-1 rounded-lg transition">
                ดูทั้งหมด
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">รายการอาหาร</th>
                    <th className="px-6 py-4 font-medium">เวลา</th>
                    <th className="px-6 py-4 font-medium">ราคา</th>
                    <th className="px-6 py-4 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <OrderRow
                    name="ข้าวกะเพราหมูกรอบ"
                    time="10:20"
                    price="฿75"
                    status="เสร็จสิ้น"
                    statusColor="bg-green-100 text-green-700"
                  />
                  <OrderRow
                    name="ตำปูปลาร้า"
                    time="10:15"
                    price="฿60"
                    status="กำลังปรุง"
                    statusColor="bg-amber-100 text-amber-700"
                  />
                  <OrderRow
                    name="ชาไทยเย็น"
                    time="10:05"
                    price="฿45"
                    status="เสร็จสิ้น"
                    statusColor="bg-green-100 text-green-700"
                  />
                  <OrderRow
                    name="ข้าวผัดอเมริกัน"
                    time="09:50"
                    price="฿120"
                    status="รอดำเนินการ"
                    statusColor="bg-slate-100 text-slate-600"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Quick Actions & Performance */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-200 to-slate-200 rounded-3xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MdMoreTime className="text-emerald-400" /> ทางลัดจัดการร้าน
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="w-full py-3 bg-sky-500 hover:bg-sky-600 rounded-xl transition text-sm font-medium border border-white/10">
                  + เพิ่มเมนูใหม่
                </button>
                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition text-sm font-bold shadow-lg shadow-emerald-500/20">
                  จัดการพนักงาน
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center">
              <p className="text-slate-500 text-sm mb-1">
                เป้าหมายยอดขายเดือนนี้
              </p>
              <h4 className="text-3xl font-black text-slate-800">75%</h4>
              <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                อีก ฿25,000 จะถึงเป้าที่ตั้งไว้
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function StatCard({ title, value, icon, className, trend }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-3xl p-1 shadow-sm border border-slate-200 transition-all hover:shadow-xl hover:-translate-y-1">
      <div
        className={`bg-gradient-to-br ${className} p-6 rounded-[22px] text-white`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <span className="text-2xl bg-white/20 p-2 rounded-lg">{icon}</span>
        </div>
        <h3 className="text-3xl font-bold mt-4 mb-2">{value}</h3>
        <p className="text-xs font-light opacity-90 bg-black/10 w-fit px-2 py-1 rounded-md">
          {trend}
        </p>
      </div>
    </div>
  );
}

function OrderRow({ name, time, price, status, statusColor }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-semibold text-slate-700">{name}</td>
      <td className="px-6 py-4 text-slate-500 text-sm">{time} น.</td>
      <td className="px-6 py-4 font-bold text-slate-800">{price}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
