const Navbar = () => {
    return (
      <nav className="fixed top-0 w-full z-50 px-4 py-4">
        <div className="relative max-w-6xl mx-auto  bg-white/10 backdrop-blur-xl border border-black/20 rounded-2xl px-10 py-3 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.08)]ring-1 ring-white/40">
          <div className="flex items-center gap-2">
            <div className="w-20 h-8 ">  {/*อย่าลบตัวค้ำกรุงศรี*/}
            </div>
          </div>
          <ul className="
            hidden md:flex
            absolute left-1/2 -translate-x-1/2
            items-center gap-8
            text-sm font-medium text-slate-700
          ">
            {["Dashboard", "Products", "About", "Contact"].map((item) => (
              <li
                key={item}
                className="relative cursor-pointer transition-colors hover:text-blue-600 group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>
          <button className="ml-auto md:hidden text-slate-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  