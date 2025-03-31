"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChalkboardTeacher, FaUsers, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

export default function AdminPanel() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        router.push("/dashboard");
      } else {
        setCurrentUser(parsedUser);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        {/* Logo at the top */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-gray-700">🔧 Panel de Administración</h1>
        {currentUser && (
          <p className="text-gray-600 text-lg mb-6">
            Bienvenido, <strong className="text-blue-600">{currentUser.name}</strong>
          </p>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/manage-tutoring")}
            className="flex items-center justify-center bg-teal-500 text-white px-5 py-3 rounded-xl hover:bg-teal-600 transition shadow-md"
          >
            <FaChalkboardTeacher className="mr-2" /> Gestionar Tutorías
          </button>

          <button
            onClick={() => router.push("/view-requests")}
            className="flex items-center justify-center bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 transition shadow-md"
          >
            <FaUsers className="mr-2" /> Ver Solicitudes
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition shadow-md"
          >
            <FaSignOutAlt className="mr-2" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
