"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600 p-6">
      <div className="p-10 bg-white shadow-2xl rounded-2xl max-w-md text-center transform transition duration-300 hover:scale-105">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Tutorías" width={80} height={80} className="animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Bienvenido a Tutorías UCC</h1>
        <p className="mt-3 text-gray-600 text-lg">
        Refuerza tu conocimiento con Tutorías de calidad para tus retos académicos
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300 w-full"
        >
          Inicia sesión
        </button>
      </div>
    </main>
  );
}

