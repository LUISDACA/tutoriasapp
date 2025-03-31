"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tutorings as initialTutorings } from "@/data/tutorings";
import { BookOpen, User, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Tutoring {
  id: number;
  subject: string;
  teacher: string;
  schedule: string;
  status: string;
}

export default function TutoringsPage() {
  const router = useRouter();
  const [tutorings, setTutorings] = useState<Tutoring[]>([]);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const loadTutorings = useCallback(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    const storedTutorings = localStorage.getItem("tutorings");
    if (storedTutorings) {
      try {
        setTutorings(JSON.parse(storedTutorings));
      } catch (error) {
        console.error("Error parsing tutorings:", error);
        localStorage.setItem("tutorings", JSON.stringify(initialTutorings));
        setTutorings(initialTutorings);
      }
    } else {
      localStorage.setItem("tutorings", JSON.stringify(initialTutorings));
      setTutorings(initialTutorings);
    }
  }, [router]);

  useEffect(() => {
    loadTutorings();
    const handleStorageChange = () => {
      loadTutorings();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadTutorings]);

  const handleRequest = (id: number) => {
    if (!user) {
      alert("You must log in to request a tutoring session.");
      return;
    }

    const updatedTutorings = tutorings.map((tutoring) =>
      tutoring.id === id ? { ...tutoring, status: "Ocupado" } : tutoring
    );

    setTutorings(updatedTutorings);
    localStorage.setItem("tutorings", JSON.stringify(updatedTutorings));

    const newRequest = {
      id,
      name: user.name || "Unknown User",
      email: user.email,
      subject: tutorings.find((t) => t.id === id)?.subject || "Unknown",
      teacher: tutorings.find((t) => t.id === id)?.teacher || "Unknown",
      schedule: tutorings.find((t) => t.id === id)?.schedule || "Unknown",
    };

    const userKey = `requestedTutorings_${user.email}`;
    const storedRequests = localStorage.getItem(userKey);
    const requests = storedRequests ? JSON.parse(storedRequests) : [];
    localStorage.setItem(userKey, JSON.stringify([...requests, newRequest]));

    window.dispatchEvent(new Event("storage"));

    router.push("/my-requests");
  };

  return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600 p-6">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
        </div>
    
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 flex items-center bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <BookOpen className="w-8 h-8 mr-2 text-teal-500" /> Lista de Tutorías
      </h1>

      <div className="w-full max-w-lg space-y-4">
        {tutorings.map((tutoring) => (
          <TutoringCard key={tutoring.id} tutoring={tutoring} onRequest={handleRequest} />
        ))}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 flex items-center bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>
    </div>
  );
}

const TutoringCard = ({
  tutoring,
  onRequest,
}: {
  tutoring: Tutoring;
  onRequest: (id: number) => void;
}) => (
  <div className="bg-white p-5 rounded-lg shadow-lg border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
      <BookOpen className="w-5 h-5 mr-2 text-teal-500" /> Materia: {tutoring.subject}
    </h2>
    <p className="text-gray-600 flex items-center">
      <User className="w-5 h-5 mr-2 text-gray-500" /> Profesor: {tutoring.teacher}
    </p>
    <p className="text-gray-600 flex items-center">
      <Clock className="w-5 h-5 mr-2 text-gray-500" /> Horario: {tutoring.schedule}
    </p>
    <button
      onClick={() => onRequest(tutoring.id)}
      className={`mt-3 flex items-center justify-center w-full py-2 rounded-lg text-white font-medium transition ${
        tutoring.status === "Disponible"
          ? "bg-teal-500 hover:bg-teal-600"
          : "bg-gray-400 cursor-not-allowed"
      }`}
      disabled={tutoring.status !== "Disponible"}
      aria-label={tutoring.status === "Disponible" ? "Request tutoring" : "Tutoring not available"}
    >
      {tutoring.status === "Disponible" ? (
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
