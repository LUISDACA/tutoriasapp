"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

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
        setError("Correo o contraseña incorrectos");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      router.push(data.user.email === "admin@example.com" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Error en el servidor", error);
      setError("Error en el servidor");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center transform transition duration-300 hover:scale-105">
        <h1 className="text-3xl font-extrabold text-gray-900">Iniciar Sesión</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {/* Campo de correo electrónico */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo de contraseña */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
          >
            Iniciar Sesión
          </button>
        </form>
        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 hover:shadow-lg transition duration-300"
        >
          Volver a la Página Principal
        </button>
      </div>
    </div>
  );
}
