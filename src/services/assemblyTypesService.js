import db from '../db/db.js';
export function getAssemblyTypes() {
  const data = db.prepare(`
    SELECT
      TIPO_ASAMBLEA.id CODIGO_TIPO_ASAMBLEA,
      TIPO_ASAMBLEA.name NOMBRE_TIPO_ASAMBLEA
    FROM assembly_types TIPO_ASAMBLEA
  `).all();
  return data;
}