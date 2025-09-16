import jwt from "jsonwebtoken";
import { config } from 'dotenv';
import * as authService from "../services/authService.js";
 
config();
const SECRET = process.env.SECRET_JWT;

export function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token requerido" });

  const token = header.split(" ")[1];
  try {
    const jwtBody = jwt.verify(token, SECRET);
    req.user = authService.getUserById(jwtBody.id);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
