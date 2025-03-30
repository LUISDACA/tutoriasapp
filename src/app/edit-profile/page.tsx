"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Edit, Save, X, ArrowLeft } from "lucide-react";
import Image from "next/image"; 

interface User {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  address: string;
}

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(true); 
  const [formData, setFormData] = useState<User>({
    email: "",
    name: "",
    lastName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(formData));
    setUser(formData);
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-pink-600">
      <div className="bg-white p-10 rounded-lg shadow-xl w-96 text-center transform transition duration-300 hover:scale-105">
        {/* Logo en la parte superior */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={120} height={120} className="object-contain" />
        </div>

        <div className="flex flex-col items-center mb-6">
          <User className="text-teal-500 w-16 h-16 mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900">Editar Perfil</h1>
        </div>

        {user && (
          <>
            <p className="text-gray-700 text-lg font-semibold mt-2">📩 {user.email}</p>

            {editing ? (
              <div className="mt-4 space-y-3">
                <InputField label="Nombre" name="name" value={formData.name} onChange={handleChange} />
                <InputField label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} />
                <InputField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} />
                <InputField label="Dirección" name="address" value={formData.address} onChange={handleChange} />

                <button
                  onClick={handleSave}
                  className="mt-2 flex items-center justify-center bg-teal-500 text-white px-8 py-4 border-2 border-teal-600 rounded-lg hover:bg-teal-600 transition duration-300 w-full"
                >
                  <Save className="w-5 h-5 mr-2" /> Guardar Cambios
                </button>
              </div>
            ) : (
              <div className="mt-4 text-gray-700 space-y-2 text-left">
                <ProfileInfo label="👤 Nombre" value={user.name} />
                <ProfileInfo label="📝 Apellido" value={user.lastName} />
                <ProfileInfo label="📞 Teléfono" value={user.phone} />
                <ProfileInfo label="🏠 Dirección" value={user.address} />
              </div>
            )}

            <button
              onClick={() => setEditing(!editing)}
              className={`mt-4 flex items-center justify-center ${
                editing ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"
              } text-white px-8 py-4 border-2 border-green-600 rounded-lg hover:bg-green-600 transition duration-300 w-full`}
            >
              {editing ? <X className="w-5 h-5 mr-2" /> : <Edit className="w-5 h-5 mr-2" />}
              {editing ? "Cancelar" : "Editar Perfil"}
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-2 flex items-center justify-center bg-red-500 text-white px-8 py-4 border-2 border-red-800 rounded-lg hover:bg-red-600 transition duration-300 w-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const InputField = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="block text-gray-700 text-sm font-medium">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="border text-gray-700 px-3 py-2 w-full rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
      placeholder={label}
    />
  </div>
);

const ProfileInfo = ({ label, value }: { label: string; value: string }) => (
  <p className="flex items-center">
    <span className="font-semibold mr-2">{label}:</span> {value || "No especificado"}
  </p>
);
