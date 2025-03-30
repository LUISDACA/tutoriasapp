"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, User, Clock, XCircle, ArrowLeft } from "lucide-react";

interface Tutoria {
  id: number;
  materia: string;
  tutor: string;
  horario: string;
  estado: "Disponible" | "Ocupado";
}

export default function MisSolicitudesPage() {
  const router = useRouter();
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    const userKey = `tutoriasSolicitadas_${userData.email}`;
    const storedTutorias = localStorage.getItem(userKey);
    if (storedTutorias) {
      try {
        setTutorias(JSON.parse(storedTutorias));
      } catch (error) {
        console.error("Error al cargar las tutorías solicitadas:", error);
        setTutorias([]);
      }
    }
  }, []);

  const cancelarTutoria = (id: number) => {
    if (!user) return;

    const tutoriaCancelada = tutorias.find((t) => t.id === id);
    if (!tutoriaCancelada) return;

    const nuevasTutorias = tutorias.filter((t) => t.id !== id);
    setTutorias(nuevasTutorias);
    localStorage.setItem(`tutoriasSolicitadas_${user.email}`, JSON.stringify(nuevasTutorias));

    // Restaurar la tutoría en la lista general
    const storedDisponibles = localStorage.getItem("tutorias");
    const tutoriasDisponibles: Tutoria[] = storedDisponibles ? JSON.parse(storedDisponibles) : [];

    const nuevasDisponibles = tutoriasDisponibles.map((t) =>
      t.id === id ? { ...t, estado: "Disponible" } : t
    );

    localStorage.setItem("tutorias", JSON.stringify(nuevasDisponibles));
    window.dispatchEvent(new Event("storage"));

    alert("Tutoría cancelada. Ahora está disponible nuevamente.");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Botón de volver al Dashboard arriba */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 flex items-center bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition shadow-md"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 flex items-center justify-center">
          <BookOpen className="w-7 h-7 mr-2" /> Mis Tutorías Solicitadas
        </h1>

        {tutorias.length > 0 ? (
          <ul className="space-y-6">
            {tutorias.map((tutoria) => (
              <li
                key={tutoria.id}
                className="bg-gray-100 p-5 rounded-lg shadow-md border-l-4 border-blue-500"
              >
                <p className="text-lg font-semibold flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> {tutoria.materia}
                </p>
                <p className="text-gray-700 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500" /> Tutor: {tutoria.tutor}
                </p>
                <p className="text-gray-700 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-500" /> Horario: {tutoria.horario}
                </p>
                <button
                  onClick={() => cancelarTutoria(tutoria.id)}
                  className="mt-4 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full shadow-md"
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

      {/* Botón de volver al Dashboard abajo */}
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 flex items-center bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition shadow-md"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>
    </div>
  );
}

