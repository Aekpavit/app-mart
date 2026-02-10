import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      
      <div className="mt-20 mb-1 flex justify-center">
        <h1 className="text-5xl font-bold text-slate-800">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 p-8 rounded-2xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <StatCard
            title="ยอดขายวันนี้"
            value="฿1"
            icon="💰"
            hint="รายได้รวมของวันนี้"
            className="from-green-500 to-emerald-600"
          />
          <StatCard
            title="สินค้าทั้งหมด"
            value="1 รายการ"
            icon="📦"
            hint="จำนวนสินค้าที่มีในระบบ"
            className="from-blue-500 to-indigo-600"
          />
          <StatCard
            title="สต็อกใกล้หมด"
            value="1"
            alert
            icon="⚠️"
            hint="สินค้าเหลือน้อยกว่าเกณฑ์"
            className="from-red-500 to-pink-600"
          />
          <StatCard
            title="ออเดอร์วันนี้"
            value="1"
            icon="🧾"
            hint="ออเดอร์ที่ถูกสร้างวันนี้"
            className="from-purple-500 to-fuchsia-600"
          />
        </div>
      </div>

      {/* Quick Actions */}

      {/* Latest Products */}
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ title, value, alert }) {
  return (
    <div
      className={`bg-white p-6 rounded-2xl border ${
        alert ? "border-red-200" : ""
      }`}
    >
      <p className="text-sm text-slate-500">{title}</p>
      <h3
        className={`text-2xl font-bold mt-2 ${
          alert ? "text-red-500" : "text-slate-800"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function ActionButton({ text }) {
  return (
    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
      {text}
    </button>
  );
}
