import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { config } from 'dotenv';
config();
const SECRET = process.env.SECRET_JWT;
import db from '../db/db.js';
export function register(data) {
  const {
    username,
    password,
    fullname,
    congregation_id
  } = data;
  const hash = bcrypt.hashSync(password, 10);

  try {
    db.prepare('INSERT INTO users (username, password, fullname, congregation_id) VALUES (?, ?, ?, ?)').run([
      username,
      hash,
      fullname,
      congregation_id
    ]);
    return { success: true, message: 'Usuario Creado'};
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error" };
  }
}
export function login(username, password) {
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "24h" });
    return { success: true, token };
  }
  return { success: false, message: "Credenciales inválidas" };
}
export function getUserById(id) {
  return db.prepare(`
    SELECT
      USER.id CODIGO_USUARIO,
      USER.fullname NOMBRE_COMPLETO,
      USER.username USERNAME,
      congregation_id CODIGO_CONGREGACION,
      CONGREGATION.name NOMBRE_CONGREGACION
    FROM users USER
    LEFT JOIN congregations CONGREGATION
     ON (
      CONGREGATION.id = USER.congregation_id
     )
    WHERE USER.id = ?  
  `).get(id) ?? null;
}
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}