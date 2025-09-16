import db from '../db/db.js';
export function createAssemblyDay(data) {
  const {
    date,
    transportTotalCost,
    busTotalSeats,
    ticketCost,
    assemblyId
  } = data;
  const result = db.prepare(`
    INSERT INTO assembly_days (
      assembly_id,
      date,
      transport_total_cost,
      bus_total_seats,
      ticket_cost
    ) VALUES (?,?,?,?,?);
  `).run([assemblyId, date, transportTotalCost, busTotalSeats, ticketCost]);
  return { id: result.lastInsertRowid };
}