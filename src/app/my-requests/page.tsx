"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, User, Clock, XCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Tutoring {
  id: number;
  subject: string;
  teacher: string;
  schedule: string;
  status: string;
}

export default function MyRequestsPage() {
  const router = useRouter();
  const [tutorings, setTutorings] = useState<Tutoring[]>([]);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
  
    try {
      const userData = JSON.parse(storedUser);
      if (!userData?.email) {
        console.error("El usuario no tiene un email válido.");
        return;
      }
  
      setUser(userData);
  
      const userKey = `requestedTutorings_${userData.email}`;
      const storedTutorings = localStorage.getItem(userKey);
  
      setTutorings(storedTutorings ? JSON.parse(storedTutorings) : []);
    } catch (error) {
      console.error("Error al cargar los datos del usuario o las tutorías:", error);
      setTutorings([]);
    }
  }, [router]);
  

  const cancelTutoring = (id: number) => {
    if (!user) return;

    const canceledTutoring = tutorings.find((t) => t.id === id);
    if (!canceledTutoring) return;

    const newTutorings = tutorings.filter((t) => t.id !== id);
    setTutorings(newTutorings);
    localStorage.setItem(`requestedTutorings_${user.email}`, JSON.stringify(newTutorings));

    const storedAvailable = localStorage.getItem("tutorings");
    const availableTutorings: Tutoring[] = storedAvailable ? JSON.parse(storedAvailable) : [];

    const newAvailable = availableTutorings.map((t) =>
      t.id === id ? { ...t, status: "Available" } : t
    );

    localStorage.setItem("tutorings", JSON.stringify(newAvailable));
    window.dispatchEvent(new Event("storage"));

    alert("Tutoring canceled. It is now available again.");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600 p-6">
      <div className="flex justify-center mb-6">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 flex items-center bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
      <BookOpen className="w-8 h-8 mr-2 text-teal-500" /> Mis Tutorías Solicitadas
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {tutorings.length > 0 ? (
          <ul className="space-y-6">
            {tutorings.map((tutoring) => (
              <li
                key={tutoring.id}
                className="bg-gray-100 p-5 rounded-lg shadow-md border-l-4 border-teal-500"
              >
                <p className="text-gray-700 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-teal-500" /> Materia: {tutoring.subject}
                </p>
                <p className="text-gray-700 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500" /> Profesor: {tutoring.teacher}
                </p>
                <p className="text-gray-700 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-500" /> Horario: {tutoring.schedule}
                </p>
                <button
                  onClick={() => cancelTutoring(tutoring.id)}
                  className="mt-4 flex items-center justify-center bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition w-full shadow-md"
                >
                  <XCircle className="w-5 h-5 mr-2" /> Cancelar Tutoría
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 text-lg">No has solicitado ninguna tutoría.</p>
        )}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 flex items-center bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>
    </div>
  );
}
