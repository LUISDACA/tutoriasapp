"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Image from "next/image"; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_CREDENTIALS = {
    email: "luis.davidca@campusucc.edu.co",
    password: "123456",
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = { email, name: "Admin", lastName: "User", role: "admin" };
      localStorage.setItem("user", JSON.stringify(adminUser));
      router.push("/admin");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Incorrect email or password");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push(data.user.email === "admin@example.com" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Server error", error);
      setError("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600">
          <div className="bg-white p-10 rounded-lg shadow-xl w-96 text-center transform transition duration-300 hover:scale-105">
            <div className="flex justify-center mb-6">
              <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
            </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Iniciar Sesión</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <form onSubmit={handleLogin} className="mt-6 space-y-6">
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-gray-700 p-4 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-gray-700 p-4 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-600 hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
          >
            Iniciar Sesión
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full bg-pink-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-700 hover:shadow-lg transition duration-300"
        >
          Volver a la Página Principal
        </button>
      </div>
    </div>
  );
}
