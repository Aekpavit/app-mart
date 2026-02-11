import { useState } from "react";

export default function MenuManager() {
  const [menus, setMenus] = useState([
    { id: 1, name: "ข้าวผัด", price: 50 },
    { id: 2, name: "กะเพรา", price: 60 },
  ]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addMenu = () => {
    if (!name || !price) return;

    setMenus([
      ...menus,
      {
        id: Date.now(),
        name,
        price: Number(price),
      },
    ]);

    setName("");
    setPrice("");
  };

  const deleteMenu = (id) => {
    setMenus(menus.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">จัดการเมนูอาหาร 🍽️</h1>

      {/* form */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="ชื่อเมนู"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-24 rounded"
          type="number"
          placeholder="ราคา"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          onClick={addMenu}
          className="bg-yellow-400 px-4 rounded font-semibold"
        >
          เพิ่ม
        </button>
      </div>

      {/* list */}
      <ul className="space-y-2">
        {menus.map((menu) => (
          <li
            key={menu.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <span>
              {menu.name} - {menu.price} บาท
            </span>
            <button
              onClick={() => deleteMenu(menu.id)}
              className="text-red-500 font-bold"
            >
              ลบ
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
