import * as reservationsService from "../services/reservationService.js";


export const createReservation = (req, res) => {
  try {
    const reservation = reservationsService.createReservation(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReservationById = (req, res) => {
  try {
    const { id } = req.params;
    const resOpe = reservationsService.deleteReservationById(id);
    res.status(200).json({succes: 'ok', data: resOpe});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReservationById = (req, res) => {
  try {
    const { id } = req.params;
    const reservation = reservationsService.getReservationById(id);
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReservation = (req, res) => {
  try {
    const { id } = req.params;
    const updatedReservation = reservationsService.updateReservation(id, req.body);
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};