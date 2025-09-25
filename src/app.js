import express from 'express';
import { config } from 'dotenv';
config();
import authRoutes from "./routes/authRoute.js";
import assembliesRoutes from './routes/assembliesRoute.js';
import reservationsRoutes from './routes/reservationRoute.js';
import expressLayouts from "express-ejs-layouts";
import assemblyTypesRoutes from './routes/assemblyTypesRoute.js';
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware, verifyJWtBasic } from './utils/authMiddleware.js';
import { cleanAndProgramDbBackup, downloadDb } from './db/dbSupabaseBackup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  await downloadDb();
  const app = express();
  app.use((req,res, next) =>{
    cleanAndProgramDbBackup();
    next();
  });
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static('public'));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(expressLayouts);                // 👈 falta esta línea
  app.set("layout", "layouts/main"); // layout por defecto
  app.use('/auth', authRoutes);
  app.use('/assemblies', assembliesRoutes);
  app.use('/assemblyTypes', assemblyTypesRoutes);
  app.use('/reservations', reservationsRoutes);
  app.get('/verify-token', verifyJWtBasic, (req, res) => {
    res.json({success: true});
  });
  app.use((req, res) => {
    res.redirect('/auth/login'); // o donde quieras
  });
  app.listen(process.env.PORT);
}
main();