import { TrackingModel } from "../models/tracking.model.js";
import { LoanModel } from "../models/loan.model.js";

const createTracking = async (req, res) => {
  try {
    const { t_date, notas, prestamo_id } = req.body;

    if (!t_date || !prestamo_id) {
      return res
        .status(400)
        .json({ ok: false, msg: "Todos los campos son obligatorios." });
    }

    const loan = await LoanModel.getLoanById(prestamo_id);
    if (!loan) {
      return res
        .status(404)
        .json({ ok: false, msg: "El préstamo asociado no existe." });
    }

    const newTracking = await TrackingModel.createTracking({
      t_date,
      notas,
      prestamo_id,
    });
    return res.status(201).json({ ok: true, msg: newTracking });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al crear el seguimiento." });
  }
};

const getAllTrackings = async (req, res) => {
  try {
    const trackings = await TrackingModel.getAllTrackings();
    return res.status(200).json({ ok: true, msg: trackings });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al obtener los seguimientos." });
  }
};

const getTrackingById = async (req, res) => {
  try {
    const { tid } = req.params;
    const tracking = await TrackingModel.getTrackingById(tid);

    if (!tracking) {
      return res
        .status(404)
        .json({ ok: false, msg: "Seguimiento no encontrado." });
    }

    return res.status(200).json({ ok: true, msg: tracking });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al obtener el seguimiento." });
  }
};

const updateTracking = async (req, res) => {
  try {
    const { tid } = req.params;
    const { t_date, status, notas } = req.body;

    const updatedTracking = await TrackingModel.updateTracking(tid, {
      t_date,
      status,
      notas,
    });

    if (!updatedTracking) {
      return res
        .status(404)
        .json({ ok: false, msg: "Seguimiento no encontrado." });
    }

    return res.status(200).json({ ok: true, msg: updatedTracking });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al actualizar el seguimiento." });
  }
};

const deleteTracking = async (req, res) => {
  try {
    const { tid } = req.params;

    const deletedTracking = await TrackingModel.deleteTracking(tid);

    if (!deletedTracking) {
      return res
        .status(404)
        .json({ ok: false, msg: "Seguimiento no encontrado." });
    }

    return res
      .status(200)
      .json({ ok: true, msg: "Seguimiento eliminado correctamente." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al eliminar el seguimiento." });
  }
};

//exportar controladores
export const TrackingController = {
  createTracking,
  getAllTrackings,
  getTrackingById,
  updateTracking,
  deleteTracking,
};
