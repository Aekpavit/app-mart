import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 ตรงนี้เอาไปต่อ API ทีหลังได้
    console.log({
      email,
      password,
    });
    navigate("/")
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="* * * * * * * * * "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-slate-500">
          ยังไม่มีบัญชี? <span className="text-red-400 cursor-pointer">สมัครสมาชิก</span>
        </p>
      </div>
    </div>
  );
}
