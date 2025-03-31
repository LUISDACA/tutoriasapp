import { NextApiRequest, NextApiResponse } from "next";
import { users } from "@/data/users"; 

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    let body;
    try {
      body = JSON.parse(req.body);
    } catch (error) {
      console.error("Error al analizar JSON:", error);
      return res.status(400).json({ error: "Error al leer el JSON" });
    }

    console.log("📩 Datos recibidos para actualización:", body);

    const { email, name, lastName, phone, address } = body;

    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      console.log("❌ Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    users[userIndex] = {
      ...users[userIndex],
      name,
      lastName,
      phone,
      address,
    };

    console.log("✅ Usuario actualizado:", users[userIndex]);

    return res.status(200).json({ user: users[userIndex] });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}