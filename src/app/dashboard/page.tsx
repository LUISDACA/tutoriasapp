"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Edit, BookOpen, ListChecks, User } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string;
    name: string;
    lastName: string;
    phone: string;
    address: string;
  } | null>(null);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center">
        <div className="flex flex-col items-center">
          <User className="text-blue-500 w-16 h-16 mb-2" />
          <h1 className="text-3xl font-extrabold text-gray-900">Bienvenido</h1>
        </div>

        {user && (
          <div className="mt-4 text-gray-700 text-lg">
            <p>👤 <span className="font-semibold">{user.name} {user.lastName}</span></p>
            <p>📩 {user.email}</p>
            <p>📞 {user.phone}</p>
            <p>🏠 {user.address}</p>
          </div>
        )}

        <div className="flex flex-col space-y-4 mt-6">
          <button
            onClick={() => router.push("/edit-profile")}
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <Edit className="w-5 h-5 mr-2" /> Editar Información
          </button>

          <button
            onClick={() => router.push("/tutorias")}
            className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            <BookOpen className="w-5 h-5 mr-2" /> Ver Tutorías Disponibles
          </button>

          <button
            onClick={() => router.push("/mis-solicitudes")}
            className="flex items-center justify-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            <ListChecks className="w-5 h-5 mr-2" /> Mis Solicitudes
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            <LogOut className="w-5 h-5 mr-2" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
