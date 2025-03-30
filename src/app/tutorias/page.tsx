"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tutorias as initialTutorias } from "@/data/tutorias";
import { BookOpen, User, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface Tutoria {
  id: number;
  materia: string;
  tutor: string;
  horario: string;
  estado: string;
}

export default function TutoriasPage() {
  const router = useRouter();
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const loadTutorias = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    const storedTutorias = localStorage.getItem("tutorias");
    if (storedTutorias) {
      try {
        setTutorias(JSON.parse(storedTutorias));
      } catch (error) {
        console.error("Error al parsear tutorías:", error);
        localStorage.setItem("tutorias", JSON.stringify(initialTutorias));
        setTutorias(initialTutorias);
      }
    } else {
      localStorage.setItem("tutorias", JSON.stringify(initialTutorias));
      setTutorias(initialTutorias);
    }
  };

  useEffect(() => {
    loadTutorias();
    const handleStorageChange = () => {
      loadTutorias();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const handleSolicitar = (id: number) => {
    if (!user) {
      alert("Debes iniciar sesión para solicitar una tutoría.");
      return;
    }

    const updatedTutorias = tutorias.map((tutoria) =>
      tutoria.id === id ? { ...tutoria, estado: "Ocupado" } : tutoria
    );

    setTutorias(updatedTutorias);
    localStorage.setItem("tutorias", JSON.stringify(updatedTutorias));

    const nuevaSolicitud = {
      id,
      nombre: user.name || "Usuario Desconocido",
      email: user.email,
      tema: tutorias.find((t) => t.id === id)?.materia || "Desconocido",
      profesor: tutorias.find((t) => t.id === id)?.tutor || "Desconocido",
      hora: tutorias.find((t) => t.id === id)?.horario || "Desconocido",
    };

    const userKey = `tutoriasSolicitadas_${user.email}`;
    const storedSolicitudes = localStorage.getItem(userKey);
    const solicitudes = storedSolicitudes ? JSON.parse(storedSolicitudes) : [];
    localStorage.setItem(userKey, JSON.stringify([...solicitudes, nuevaSolicitud]));

    window.dispatchEvent(new Event("storage"));

    router.push("/mis-solicitudes");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 flex items-center bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <BookOpen className="w-8 h-8 mr-2 text-blue-600" /> Lista de Tutorías
      </h1>

      <div className="w-full max-w-lg space-y-4">
        {tutorias.map((tutoria) => (
          <TutoriaCard key={tutoria.id} tutoria={tutoria} onSolicitar={handleSolicitar} />
        ))}
      </div>

      {}
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 flex items-center bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>
    </div>
  );
}

const TutoriaCard = ({
  tutoria,
  onSolicitar,
}: {
  tutoria: Tutoria;
  onSolicitar: (id: number) => void;
}) => (
  <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
      <BookOpen className="w-5 h-5 mr-2 text-blue-500" /> {tutoria.materia}
    </h2>
    <p className="text-gray-600 flex items-center">
      <User className="w-5 h-5 mr-2 text-gray-500" /> Tutor: {tutoria.tutor}
    </p>
    <p className="text-gray-600 flex items-center">
      <Clock className="w-5 h-5 mr-2 text-gray-500" /> Horario: {tutoria.horario}
    </p>
    <button
      onClick={() => onSolicitar(tutoria.id)}
      className={`mt-3 flex items-center justify-center w-full py-2 rounded-lg text-white font-medium transition ${
        tutoria.estado === "Disponible"
          ? "bg-blue-500 hover:bg-blue-600"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      disabled={tutoria.estado !== "Disponible"}
      aria-label={tutoria.estado === "Disponible" ? "Solicitar tutoría" : "Tutoría no disponible"}
    >
      {tutoria.estado === "Disponible" ? (
        <>
          <CheckCircle className="w-5 h-5 mr-2" /> Solicitar
        </>
      ) : (
        <>
          <XCircle className="w-5 h-5 mr-2" /> No disponible
        </>
      )}
    </button>
  </div>
);
