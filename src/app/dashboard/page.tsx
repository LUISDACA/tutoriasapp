"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Edit, BookOpen, ListChecks, User } from "lucide-react";
import Image from "next/image"; 

export default function UserDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    lastName: string;
  } | null>(null);

  const fetchUser = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-96 text-center transform transition duration-300 hover:scale-105">
        {}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
        </div>

        <div className="flex flex-col items-center mb-6">
          <User className="text-teal-600 w-16 h-16 mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900">Bienvenido</h1>
        </div>

        {currentUser && (
          <div className="mt-4 text-gray-700 text-lg">
            <p>👤 <span className="font-semibold">{currentUser.name} {currentUser.lastName}</span></p>
            <p>📩 {currentUser.email}</p>
          </div>
        )}

        <div className="flex flex-col space-y-4 mt-6">
          <button
            onClick={() => router.push("/edit-profile")}
            className="flex items-center justify-center bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition duration-300"
          >
            <Edit className="w-5 h-5 mr-2" /> Editar Información
          </button>

          <button
            onClick={() => router.push("/tutoring")}
            className="flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            <BookOpen className="w-5 h-5 mr-2" /> Ver Tutorías Disponibles
          </button>

          <button
            onClick={() => router.push("/my-requests")}
            className="flex items-center justify-center bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            <ListChecks className="w-5 h-5 mr-2" /> Mis Solicitudes
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition duration-300"
          >
            <LogOut className="w-5 h-5 mr-2" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
