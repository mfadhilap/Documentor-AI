"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState("landing"); // landing | login | register
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    if (data.success) {
      router.push("/timeline");
    } else {
      setError(data.error);
    }
  }

  async function handleRegister() {
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });
    const data = await res.json();
    if (data.success) {
      setError("");
      setView("login");
    } else {
      setError(data.error);
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <img src="/bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center w-full h-[60px] bg-navy px-5">
        <div className="flex items-center gap-2">
          <img src="/list.svg" width={40} height={35} alt="" />
          <span className="text-white text-2xl font-bold">Docu</span>
          <span className="text-light-blue text-2xl font-bold">Mentor</span>
          <span className="text-white text-2xl font-bold">Ai</span>
        </div>
        <img src="/prof.svg" width={30} height={30} alt="" className="cursor-pointer" />
      </nav>

      {/* Landing */}
      {view === "landing" && (
        <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-60px)]">
          <div className="text-center mb-10">
            <p className="text-white font-black" style={{ fontSize: "112px", lineHeight: 1 }}>
              <span style={{ color: "#A2CAFF" }}>DOCU</span>
              <span>MENTOR</span>
              <span style={{ color: "#A2CAFF" }}> Ai</span>
            </p>
          </div>
          <button
            onClick={() => setView("login")}
            className="bg-white text-navy font-bold text-xl px-10 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Auth box */}
      {(view === "login" || view === "register") && (
        <div className="relative z-10 flex items-center justify-center h-[calc(100vh-60px)]">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-[380px]">
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            {view === "login" && (
              <>
                <h2 className="text-2xl font-bold text-navy mb-6 text-center">Log In</h2>
                <input
                  type="text"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-navy"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-navy"
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Login
                </button>
                <p
                  onClick={() => { setView("register"); setError(""); }}
                  className="text-center text-navy mt-4 cursor-pointer hover:underline text-sm"
                >
                  Sign up now
                </p>
              </>
            )}

            {view === "register" && (
              <>
                <h2 className="text-2xl font-bold text-navy mb-6 text-center">Register</h2>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-navy"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-navy"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-navy"
                />
                <button
                  onClick={handleRegister}
                  className="w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Register
                </button>
                <p
                  onClick={() => { setView("login"); setError(""); }}
                  className="text-center text-navy mt-4 cursor-pointer hover:underline text-sm"
                >
                  Already have an account? Log in
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
