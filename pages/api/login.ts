import { NextApiRequest, NextApiResponse } from "next";
import { users } from "@/data/users"; // Asegúrate de que esta ruta es correcta

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
