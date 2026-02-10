const Navbar = () => {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-4 py-4">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg border border-white/40 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-blue-900/5 ring-1 ring-slate-900/5">
          <div className="flex items-center gap-2">
            {/* Logo Icon */}
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              M
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">MART</h1>
          </div>
          
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            {['Home', 'Products', 'About', 'Contact'].map((item) => (
              <li key={item} className="hover:text-blue-600 cursor-pointer transition-colors relative group py-1">
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>
          
          <button className="md:hidden text-slate-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
