import db from '../db/db.js';
import * as assemblyDaysService from './assemblyDaysService.js';

export function getActiveAssemblies({congregation_id, id, getDays = false , getReservations = false }) {  
  let mianSelect = `
  SELECT
      ASAMBLEA.id CODIGO,
      ASAMBLEA.name NOMBRE_ASAMBLEA,
      ASAMBLEA.type_id CODIGO_TIPO_ASAMBLEA,
      TIPO_ASAMBLEA.name NOMBRE_TIPO_ASAMBLEA,
      ASAMBLEA.congregation_id CODIGO_CONGREGACION,
      CONGREGACION.name NOMBRE_CONGREGACION,
      ASAMBLEA.created_by CODIGO_USUARIO_CREADOR,
      USUARIO_CREADOR.fullname NOMBRE_COMPLETO_USUARIO_CREADOR,
      (
        SELECT
          DAY.date
        FROM assembly_days DAY
        WHERE DAY.assembly_id = ASAMBLEA.id
        ORDER BY DAY.date DESC LIMIT 1
      ) AS ULTIMO_DIA_ASAMBLEA,
      (
        SELECT
          DAY.date
        FROM assembly_days DAY
        WHERE DAY.assembly_id = ASAMBLEA.id
        ORDER BY DAY.date ASC LIMIT 1
      ) AS PRIMER_DIA_ASAMBLEA
  `;
  let mainFromWhere = `
    FROM assemblies ASAMBLEA
    LEFT JOIN assembly_types TIPO_ASAMBLEA
      ON (
        TIPO_ASAMBLEA.id = ASAMBLEA.type_id
      )
    LEFT JOIN congregations CONGREGACION
      ON (
        CONGREGACION.id = ASAMBLEA.congregation_id
      )
    LEFT JOIN users USUARIO_CREADOR
      ON (
        USUARIO_CREADOR.id = ASAMBLEA.created_by
      )
    WHERE ASAMBLEA.congregation_id = ?
  `;
  const params = [congregation_id];
  if (id) {
    mainFromWhere = mainFromWhere.concat(`
        AND ASAMBLEA.id = ?
    `);
    params.push(id);
  }
  const mainSql = mianSelect.concat(mainFromWhere);
  const assemblies = db.prepare(mainSql).all(params);
  if (getDays) {
    fillAssemblyDays({
      mainFromWhere,
      params,
      assemblies,
      getReservations
    });
  }
  
  return assemblies;
}
function fillAssemblyDays({mainFromWhere, params, assemblies, getReservations}) {
  const selectDays = `
    SELECT
      DAY.id CODIGO,
      DAY.assembly_id CODIGO_ASAMBLEA,
      DAY.date FECHA,
      DAY.transport_total_cost COSTO_TOTAL_BUS,
      DAY.bus_total_seats TOTAL_ASIENTOS,
      DAY.ticket_cost COSTO_PASAJE
  `;
  const daysFromWhere = `
    FROM assembly_days DAY
    WHERE DAY.assembly_id IN (
      SELECT
        ASAMBLEA.id
      ${mainFromWhere}
    )
  `;
  const daysQuery = selectDays.concat(daysFromWhere);
  const days = db.prepare(daysQuery).all(params);
  mapDaysOnAssemblies(assemblies, days);
  if (getReservations) {
    fillReservations({days, daysFromWhere, params});
  }
}
function fillReservations({days, daysFromWhere, params}) {
  const selectReservations = `
    SELECT
      RESERVACION.id CODIGO,
      RESERVACION.assembly_day_id CODIGO_DIA_ASAMBLEA,
      RESERVACION.representative_name REPRESENTANTE,
      RESERVACION.tickets_count CANTIDAD_PASAJES,
      RESERVACION.amount_paid CANTIDAD_PAGADA
  `;
  const reservationsFromWhere = `
    FROM reservations RESERVACION
    WHERE RESERVACION.assembly_day_id IN (
      SELECT
        DAY.Id
      ${daysFromWhere}
    );
  `;
  const reservationsQuery = selectReservations.concat(reservationsFromWhere);
  const reservations = db.prepare(reservationsQuery).all(params);
  mapReservationsOnDays(days, reservations);
}
function mapReservationsOnDays(days, reservations){
  const daysMap = {};
  days?.forEach(day => {
    day.reservations = [];
    daysMap[day.CODIGO] = day;
  });
  reservations?.forEach(reservation => {
    const day = daysMap[reservation.CODIGO_DIA_ASAMBLEA];
    day.reservations.push(reservation);
  });
}
function mapDaysOnAssemblies(assemblies, days) {
  const assembliesMap = {};
  assemblies?.forEach(assembly => {
    assembly.days = [];
    assembliesMap[assembly.CODIGO] = assembly;
  });
  days?.forEach(day => {
    const assembly = assembliesMap[day.CODIGO_ASAMBLEA];
    assembly.days.push(day);
  });
}
export function createAssembly(data, userRequest) {
  const { 
    assemblyTypeId,
    name,
    days = []
  } = data;
  const congregation_id = userRequest.CODIGO_CONGREGACION;
  const created_by = userRequest.CODIGO_USUARIO;
  const result = db.prepare(`
    INSERT INTO assemblies (name, type_id, congregation_id, created_by)
    VALUES (?, ?, ?, ?)
  `).run([name, assemblyTypeId, congregation_id, created_by]);
  const assemblyId = result.lastInsertRowid;
  days.forEach(day => {
    assemblyDaysService.createAssemblyDay({
      ...day,
      assemblyId
    });
  });
  return { id: assemblyId };
}