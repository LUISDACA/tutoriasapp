"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Asegúrate de importar Image
import { useRouter } from "next/navigation";

interface Solicitud {
  id: number;
  nombre: string;
  email: string;
  tema: string;
  profesor: string;
  hora: string;
}

export default function VerSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      let allSolicitudes: Solicitud[] = [];

      // Recorrer todas las claves de localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("tutoriasSolicitadas_")) {
          const storedSolicitudes = localStorage.getItem(key);
          if (storedSolicitudes) {
            try {
              const parsedSolicitudes: Solicitud[] = JSON.parse(storedSolicitudes);
              if (Array.isArray(parsedSolicitudes)) {
                allSolicitudes = [...allSolicitudes, ...parsedSolicitudes];
              }
            } catch (error) {
              console.warn(`⚠️ Error al parsear solicitudes de ${key}:`, error);
            }
          }
        }
      }

      setSolicitudes(allSolicitudes);
    } catch (error) {
      console.error("❌ Error al obtener las solicitudes:", error);
    }
  }, []);

  const handleVolver = () => {
    router.push("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600 p-6">
      
      {}
      <div className="flex justify-center mb-6">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">📋 Solicitudes de Tutorías</h1>
        
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleVolver} 
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
          >
            ⬅ Volver
          </button>
        </div>
        
        {solicitudes.length === 0 ? (
          <p className="text-gray-500 text-center">❌ No hay solicitudes registradas.</p>
        ) : (
          <ul className="space-y-4">
            {solicitudes.map((solicitud, index) => (
              <li key={index} className="border p-4 rounded-lg shadow">
                <p className="text-gray-700">👤 Nombre: {solicitud.nombre}</p>
                <p className="text-gray-700">📩 Email: {solicitud.email}</p>
                <p className="text-gray-700">📖 Tema: {solicitud.tema}</p>
                <p className="text-gray-700">👨‍🏫 Profesor: {solicitud.profesor}</p>
                <p className="text-gray-700">⏰ Hora: {solicitud.hora}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
