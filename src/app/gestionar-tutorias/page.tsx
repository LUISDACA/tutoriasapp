"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tutorias as initialTutorias } from "@/data/tutorias";

interface Tutoria {
  id: number;
  materia: string;
  tutor: string;
  horario: string;
  estado: string;
}

export default function GestionarTutoriasPage() {
  const router = useRouter();
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);
  const [editingTutoria, setEditingTutoria] = useState<Tutoria | null>(null);
  const [newTutoria, setNewTutoria] = useState<Tutoria>({
    id: 0,
    materia: "",
    tutor: "",
    horario: "",
    estado: "Disponible",
  });

  useEffect(() => {
    const storedTutorias = localStorage.getItem("tutorias");
    if (storedTutorias) {
      setTutorias(JSON.parse(storedTutorias));
    } else {
      localStorage.setItem("tutorias", JSON.stringify(initialTutorias));
      setTutorias(initialTutorias);
    }
  }, []);

  const handleDelete = (id: number) => {
    const updatedTutorias = tutorias.filter((tutoria) => tutoria.id !== id);
    setTutorias(updatedTutorias);
    localStorage.setItem("tutorias", JSON.stringify(updatedTutorias));
  };

  const handleEdit = (tutoria: Tutoria) => {
    setEditingTutoria(tutoria);
  };

  const handleSaveEdit = () => {
    if (!editingTutoria) return;
    
    const updatedTutorias = tutorias.map((tutoria) =>
      tutoria.id === editingTutoria.id ? editingTutoria : tutoria
    );

    setTutorias(updatedTutorias);
    localStorage.setItem("tutorias", JSON.stringify(updatedTutorias));
    setEditingTutoria(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTutoria) return;
    setEditingTutoria({ ...editingTutoria, [e.target.name]: e.target.value });
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTutoria({ ...newTutoria, [e.target.name]: e.target.value });
  };

  const handleAddTutoria = () => {
    if (!newTutoria.materia || !newTutoria.tutor || !newTutoria.horario) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const updatedTutorias = [
      ...tutorias,
      { ...newTutoria, id: tutorias.length ? tutorias[tutorias.length - 1].id + 1 : 1 },
    ];

    setTutorias(updatedTutorias);
    localStorage.setItem("tutorias", JSON.stringify(updatedTutorias));

    setNewTutoria({ id: 0, materia: "", tutor: "", horario: "", estado: "Disponible" });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      {/* Botón de Volver (arriba) */}
      <button
        onClick={() => router.push("/admin")}
        className="mb-4 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        ⬅ Volver
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Gestionar Tutorías</h1>

      <div className="w-full max-w-lg space-y-4">
        {tutorias.map((tutoria) => (
          <div key={tutoria.id} className="bg-white p-5 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-900">{tutoria.materia}</h2>
            <p className="text-gray-600">👨‍🏫 Tutor: {tutoria.tutor}</p>
            <p className="text-gray-600">⏰ Horario: {tutoria.horario}</p>
            <p className="text-gray-600">📌 Estado: {tutoria.estado}</p>

            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleEdit(tutoria)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(tutoria.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {editingTutoria && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">✏️ Editar Tutoría</h2>
            <input
              type="text"
              name="materia"
              value={editingTutoria.materia}
              onChange={handleEditChange}
              className="w-full p-2 border rounded-lg mb-2"
              placeholder="Materia"
            />
            <input
              type="text"
              name="tutor"
              value={editingTutoria.tutor}
              onChange={handleEditChange}
              className="w-full p-2 border rounded-lg mb-2"
              placeholder="Tutor"
            />
            <input
              type="text"
              name="horario"
              value={editingTutoria.horario}
              onChange={handleEditChange}
              className="w-full p-2 border rounded-lg mb-2"
              placeholder="Horario"
            />

            <div className="flex justify-end space-x-2">
              <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                💾 Guardar
              </button>
              <button onClick={() => setEditingTutoria(null)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario para agregar nueva tutoría */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">➕ Agregar Nueva Tutoría</h2>
        <input
          type="text"
          name="materia"
          value={newTutoria.materia}
          onChange={handleNewChange}
          className="w-full p-2 border rounded-lg mb-2"
          placeholder="Materia"
        />
        <input
          type="text"
          name="tutor"
          value={newTutoria.tutor}
          onChange={handleNewChange}
          className="w-full p-2 border rounded-lg mb-2"
          placeholder="Tutor"
        />
        <input
          type="text"
          name="horario"
          value={newTutoria.horario}
          onChange={handleNewChange}
          className="w-full p-2 border rounded-lg mb-2"
          placeholder="Horario"
        />
        <button
          onClick={handleAddTutoria}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full transition"
        >
          ✅ Agregar Tutoría
        </button>
      </div>

      <button
        onClick={() => router.push("/admin")}
        className="mt-6 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        ⬅ Volver
      </button>
    </div>
  );
}

