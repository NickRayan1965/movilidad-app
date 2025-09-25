import jwt from "jsonwebtoken";
import { config } from 'dotenv';
import * as authService from "../services/authService.js";
 
config();
const SECRET = process.env.SECRET_JWT;

function handleAuthError(req, res, message = "Token inválido o expirado") {
  const accept = req.headers["accept"] || "";
  const isFetch = accept.includes("application/json") || req.xhr;

  if (isFetch) {
    return res.status(401).json({ error: message });
  } else {
    return res.redirect("/auth/login");
  }
}

export function authMiddleware(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return handleAuthError(req, res, "Token requerido");

  const token = header.split(" ")[1];
  try {
    const jwtBody = jwt.verify(token, SECRET);
    req.user = authService.getUserById(jwtBody.id);
    next();
  } catch {
    handleAuthError(req, res);
  }
}
export function verifyJWtBasic(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "Token requerido" });
  const token = header.split(" ")[1];
  try {
    const jwtBody = jwt.verify(token, SECRET);
    req.user = authService.getUserById(jwtBody.id);
    next();
  } catch {
    res.status(401).json({ error: "Token invalido" });
  }

}