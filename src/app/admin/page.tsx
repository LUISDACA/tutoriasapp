"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChalkboardTeacher, FaUsers, FaSignOutAlt } from "react-icons/fa";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string; role?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        router.push("/dashboard"); // Si no es admin, lo redirige
      } else {
        setUser(parsedUser);
      }
    } else {
      router.push("/login"); // Si no hay usuario, lo manda a login
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">🔧 Panel de Administración</h1>
        {user && (
          <p className="text-gray-600 text-lg mb-6">
            Bienvenido, <strong className="text-blue-600">{user.name}</strong>
          </p>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/gestionar-tutorias")}
            className="flex items-center justify-center bg-blue-500 text-white px-5 py-3 rounded-xl hover:bg-blue-600 transition shadow-md"
          >
            <FaChalkboardTeacher className="mr-2" /> Gestionar Tutorías
          </button>

          <button
            onClick={() => router.push("/ver-solicitudes")}
            className="flex items-center justify-center bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 transition shadow-md"
          >
            <FaUsers className="mr-2" /> Ver Solicitudes
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition shadow-md"
          >
            <FaSignOutAlt className="mr-2" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

