"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Request {
  id: number;
  name: string;
  email: string;
  subject: string;
  teacher: string;
  schedule: string;
}

export default function ViewRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      let allRequests: Request[] = [];

      // Iterate through all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("requestedTutorings_")) {
          const storedRequests = localStorage.getItem(key);
          if (storedRequests) {
            try {
              const parsedRequests: Request[] = JSON.parse(storedRequests);
              if (Array.isArray(parsedRequests)) {
                allRequests = [...allRequests, ...parsedRequests];
              }
            } catch (error) {
              console.warn(`⚠️ Error parsing requests from ${key}:`, error);
            }
          }
        }
      }

      setRequests(allRequests);
    } catch (error) {
      console.error("❌ Error retrieving requests:", error);
    }
  }, []);

  const handleBack = () => {
    router.push("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600 p-6">
      
      <div className="flex justify-center mb-6">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">📋 Solicitudes de Tutorías</h1>
        
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleBack} 
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
          >
            ⬅ Volver
          </button>
        </div>
        
        {requests.length === 0 ? (
          <p className="text-gray-500 text-center">❌ No hay solicitudes registradas</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request, index) => (
              <li key={index} className="border p-4 rounded-lg shadow">
                <p className="text-gray-700">👤 Nombre: {request.name}</p>
                <p className="text-gray-700">📩 Email: {request.email}</p>
                <p className="text-gray-700">📖 Materia: {request.subject}</p>
                <p className="text-gray-700">👨‍🏫 Profesor: {request.teacher}</p>
                <p className="text-gray-700">⏰ Horario: {request.schedule}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
