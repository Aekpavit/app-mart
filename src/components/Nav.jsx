import { NavLink } from "react-router-dom";

const Navbar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/home" },
    { name: "menu", path: "/showmenu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4">
      <div className="relative max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-black/20 rounded-2xl px-10 py-3 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-white/40">
        
        <div className="flex items-center gap-2">
          <div className="w-20 h-8">{/* อย่าลบตัวค้ำกรุงศรี */}</div>
        </div>

        <ul
          className="
            hidden md:flex
            absolute left-1/2 -translate-x-1/2
            items-center gap-8
            text-sm font-medium text-slate-700
          "
        >
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative cursor-pointer transition-colors group
                  ${isActive ? "text-lime-600" : "hover:text-lime-600"}`
                }
              >
                {item.name}
                <span
                  className="
                    absolute -bottom-1 left-0 h-1 bg-green-600 rounded-full
                    transition-all duration-300
                    w-0 group-hover:w-full
                  "
                ></span>
              </NavLink>
            </li>
          ))}
        </ul>

        <button className="ml-auto md:hidden text-slate-700">
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
