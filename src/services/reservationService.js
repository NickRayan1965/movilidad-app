import db from '../db/db.js';
export function createReservation(data) {
  const {
    representative,
    ticketCount,
    amountPaid,
    assemblyDayId,
  } = data;
  const res = db.prepare(`
    INSERT INTO reservations (
      assembly_day_id,
      representative_name,
      tickets_count,
      amount_paid
    ) VALUES (
      ?,?,?,?
    );
  `).run([
    assemblyDayId,
    representative,
    ticketCount,
    amountPaid
  ]);
  return { id: res.lastInsertRowid };
}
export function getReservationById(id) {
  const reservation = db.prepare(`
    SELECT
      RESERVACION.id CODIGO
      RESERVACION.assembly_day_id CODIGO_DIA_ASAMBLEA,
      RESERVACION.representative_name REPRESENTANTE,
      RESERVACION.tickets_count CANTIDAD_PASAJES,
      RESERVACION.amount_paid CANTIDAD_PAGADA
    FROM reservations RESERVACION
    WHERE id = ?
  `).get(id);

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  return reservation;
}
export function updateReservation(id, data) {
  const reservation = getReservationById(id);
  reservation.CODIGO_DIA_ASAMBLEA = data.assemblyDayId !== undefined ? data.assemblyDayId : reservation.CODIGO_DIA_ASAMBLEA;
  reservation.REPRESENTANTE = data.representative !== undefined ? data.representative : reservation.REPRESENTANTE;
  reservation.CANTIDAD_PASAJES = data.ticketCount !== undefined ? data.ticketCount : reservation.CANTIDAD_PASAJES;
  reservation.CANTIDAD_PAGADA = data.amountPaid !== undefined ? data.amountPaid : reservation.CANTIDAD_PAGADA;

  db.prepare(`
    UPDATE reservations
    SET
      assembly_day_id = ?,
      representative_name = ?,
      tickets_count = ?,
      amount_paid = ?
    WHERE id = ?
  `).run([
    reservation.CODIGO_DIA_ASAMBLEA,
    reservation.REPRESENTANTE,
    reservation.CANTIDAD_PASAJES,
    reservation.CANTIDAD_PAGADA,
    id,
  ]);

  return getReservationById(id);
} 
export function deleteReservationById(id) {
  const reservation = getReservationById(id);

  db.prepare(`
    DELETE FROM reservations
    WHERE id = ?
  `).run(id);

  return { message: `Reservation with ID ${reservation.CODIGO} has been deleted.` };
}