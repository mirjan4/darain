import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../utils/api";
import { Eye, EyeOff, User } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { UPLOADS_BASE_URL } from '../utils/api';



const Login = () => {
  const { brand_name, logo } = useSettings();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginApi(credentials);
      if (res.data.status === "success") {
        localStorage.setItem("admin_token", res.data.token);
        navigate("/admin/products");
      }
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };
   const logoSrc = logo ? `${UPLOADS_BASE_URL}/${logo}` : null;

  return (
    <div className="min-h-screen flex font-sans bg-[#0B0B0B] text-white overflow-hidden">

      {/* --- Luxury Background Glow --- */}
      <div className="absolute w-[600px] h-[600px] bg-[#D4AF37]/10 blur-[120px] rounded-full top-[-200px] left-[-200px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full bottom-[-200px] right-[-200px]"></div>

      {/* --- Left Side (Luxury Branding) --- */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">

        <div className="text-center space-y-6 animate-[fadeIn_1.2s_ease-in-out]">

          <img
            src={logoSrc}
            alt="Logo"
            className="w-28 mx-auto animate-[float_5s_ease-in-out_infinite]"
          />

          <h1 className="text-5xl font-light tracking-[0.2em] text-[#D4AF37]">
            {brand_name || "DARAIN"}
          </h1>

          <p className="text-xs tracking-[0.4em] text-white/40 uppercase">
            Admin Panel
          </p>

        </div>
      </div>

      {/* --- Right Side (Glass Login Card) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">

        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10
        p-10 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] space-y-10
        animate-[fadeIn_1s_ease-in]">

          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-light tracking-wide text-white">
              Welcome Back
            </h2>
            <p className="text-xs tracking-[0.3em] text-white/40 uppercase">
              Secure Admin Login
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div className="relative group">
              <input
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                placeholder="USERNAME"
                className="w-full px-6 py-4 bg-white/10 text-white rounded-xl text-xs tracking-[0.15em]
                placeholder:text-white/30 border border-white/10
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40
                focus:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                transition-all duration-300"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={credentials.password}
                onChange={handleChange}
                placeholder="PASSWORD"
                className="w-full px-6 py-4 bg-white/10 text-white rounded-xl text-xs tracking-[0.15em]
                placeholder:text-white/30 border border-white/10
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40
                focus:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                transition-all duration-300"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#D4AF37]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[#D4AF37] text-xs text-center tracking-widest">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-xs tracking-[0.3em] font-bold uppercase
              bg-gradient-to-r from-[#D4AF37] to-[#F5E6C4] text-black
              hover:scale-[1.03] hover:shadow-[0_10px_40px_rgba(212,175,55,0.4)]
              transition-all duration-300"
            >
              {loading ? "PLEASE WAIT..." : "ENTER"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-[10px] text-white/30 tracking-widest">
            © {new Date().getFullYear()} {brand_name || "DARAIN"}
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;