"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tutorings as initialTutorings } from "@/data/tutorings";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface Tutoring {
  id: number;
  subject: string;
  teacher: string;
  schedule: string;
  status: string;
}

export default function ManageTutoringsPage() {
  const router = useRouter();
  const [tutorings, setTutorings] = useState<Tutoring[]>([]);
  const [editingTutoring, setEditingTutoring] = useState<Tutoring | null>(null);
  const [newTutoring, setNewTutoring] = useState<Tutoring>({
    id: 0,
    subject: "",
    teacher: "",
    schedule: "",
    status: "Available",
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("12:00");

  useEffect(() => {
    const storedTutorings = localStorage.getItem("tutorings");
    if (storedTutorings) {
      setTutorings(JSON.parse(storedTutorings));
    } else {
      localStorage.setItem("tutorings", JSON.stringify(initialTutorings));
      setTutorings(initialTutorings);
    }
  }, [newTutoring]);
  
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "MMM d, yyyy");
      const scheduleString = `${formattedDate} at ${selectedTime}`;
      setNewTutoring({ ...newTutoring, schedule: scheduleString });
    }
  }, [selectedDate, selectedTime, newTutoring]);

  const handleDelete = (id: number) => {
    const updatedTutorings = tutorings.filter((tutoring) => tutoring.id !== id);
    setTutorings(updatedTutorings);
    localStorage.setItem("tutorings", JSON.stringify(updatedTutorings));
  };

  const handleEdit = (tutoring: Tutoring) => {
    setEditingTutoring(tutoring);
    
    try {
      const scheduleParts = tutoring.schedule.split(" at ");
      if (scheduleParts.length === 2) {
        // Esto es una simplificación para parsear la fecha - podría necesitar lógica adicional
        const datePart = new Date(scheduleParts[0]);
        const timePart = scheduleParts[1];
        
        if (!isNaN(datePart.getTime())) {
          setSelectedDate(datePart);
          setSelectedTime(timePart);
        }
      }
    } catch (e) {
      console.log("Error parsing date", e);
    }
  };

  const handleSaveEdit = () => {
    if (!editingTutoring) return;
    
    const updatedTutorings = tutorings.map((tutoring) =>
      tutoring.id === editingTutoring.id ? editingTutoring : tutoring
    );

    setTutorings(updatedTutorings);
    localStorage.setItem("tutorings", JSON.stringify(updatedTutorings));
    setEditingTutoring(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTutoring) return;
    setEditingTutoring({ ...editingTutoring, [e.target.name]: e.target.value });
  };
  
  const handleEditDateChange = (date: Date | null) => {
    if (!editingTutoring || !date) return;
    const formattedDate = format(date, "MMM d, yyyy");
    const scheduleString = `${formattedDate} at ${selectedTime}`;
    setSelectedDate(date);
    setEditingTutoring({ ...editingTutoring, schedule: scheduleString });
  };
  
  const handleEditTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTutoring || !selectedDate) return;
    const time = e.target.value;
    setSelectedTime(time);
    const formattedDate = format(selectedDate, "MMM d, yyyy");
    const scheduleString = `${formattedDate} at ${time}`;
    setEditingTutoring({ ...editingTutoring, schedule: scheduleString });
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTutoring({ ...newTutoring, [e.target.name]: e.target.value });
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleAddTutoring = () => {
    if (!newTutoring.subject || !newTutoring.teacher || !newTutoring.schedule) {
      alert("Please complete all fields.");
      return;
    }

    const updatedTutorings = [
      ...tutorings,
      { ...newTutoring, id: tutorings.length ? tutorings[tutorings.length - 1].id + 1 : 1 },
    ];

    setTutorings(updatedTutorings);
    localStorage.setItem("tutorings", JSON.stringify(updatedTutorings));

    setNewTutoring({ id: 0, subject: "", teacher: "", schedule: "", status: "Available" });
    setSelectedDate(null);
    setSelectedTime("12:00");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600 p-6">
      {}
      <div className="flex justify-center mb-6">
        <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
      </div>

      {}
      <button
        onClick={() => router.push("/admin")}
        className="mb-4 bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition"
      >
        ⬅ Volver
      </button>

      <h1 className="text-3xl font-bold text-white mb-6">📋 Manage Tutoring Sessions</h1>

      <div className="w-full max-w-lg space-y-4">
        {tutorings.map((tutoring) => (
          <div key={tutoring.id} className="bg-white p-5 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-900">{tutoring.subject}</h2>
            <p className="text-gray-600">👨‍🏫 Profesor: {tutoring.teacher}</p>
            <p className="text-gray-600">⏰ Horario: {tutoring.schedule}</p>
            <p className="text-gray-600">📌 Estado: {tutoring.status}</p>

            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleEdit(tutoring)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => handleDelete(tutoring.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {}
      {editingTutoring && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-teal-400 to-pink-600 p-6 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-gray-700 font-bold mb-4">✏️ Editar Tutoría</h2>
            <input
              type="text"
              name="Subject"
              value={editingTutoring.subject}
              onChange={handleEditChange}
              className="w-full p-2 border rounded-lg mb-2 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Materia"
            />
            <input
              type="text"
              name="teacher"
              value={editingTutoring.teacher}
              onChange={handleEditChange}
              className="w-full p-2 border rounded-lg mb-2 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Profesor"
            />
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">📅 Seleccionar fecha:</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleEditDateChange}
                className="w-full p-2 border rounded-lg bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                dateFormat="MMM d, yyyy"
                placeholderText="Seleccionar una fecha"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">⏰ Seleccionar hora:</label>
              <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 focus-within:ring-teal-500">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={handleEditTimeChange}
                  className="w-full bg-transparent text-gray-700 focus:outline-none"
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Scheduled for: {editingTutoring.schedule}
            </p>

            <div className="flex justify-end space-x-2">
              <button onClick={handleSaveEdit} className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">
                💾 Guardar
              </button>
              <button onClick={() => setEditingTutoring(null)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 w-full max-w-lg">
        <h2 className="text-gray-700 font-bold mb-4">➕ Agregar Nueva Tutoría</h2>
        <input
          type="text"
          name="subject"
          value={newTutoring.subject}
          onChange={handleNewChange}
          className="w-full p-2 border rounded-lg mb-2 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Materia"
        />
        <input
          type="text"
          name="teacher"
          value={newTutoring.teacher}
          onChange={handleNewChange}
          className="w-full p-2 border rounded-lg mb-2 bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Profesor"
        />
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">📅 Seleccionar fecha:</label>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            className="w-full p-2 border rounded-lg bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            dateFormat="MMM d, yyyy"
            placeholderText="Seleccionar una fecha"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">⏰ Seleccionar hora:</label>
          <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 focus-within:ring-teal-500">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className="w-full bg-transparent text-gray-700 focus:outline-none"
            />
          </div>
        </div>
        
        {selectedDate && (
          <p className="text-sm text-gray-500 mb-4">
            Scheduled for: {newTutoring.schedule}
          </p>
        )}
        
        <button
          onClick={handleAddTutoring}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full transition"
        >
          ✅ Agregar Tutoría
        </button>
      </div>

      <button
        onClick={() => router.push("/admin")}
        className="mt-6 flex items-center bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition"
      >
        ⬅ Volver
      </button>
    </div>
  );
}