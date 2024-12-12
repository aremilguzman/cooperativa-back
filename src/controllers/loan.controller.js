import { LoanModel } from "../models/loan.model.js";
import { PartnerModel } from "../models/partner.model.js";

//controlador para crear prestamos
const createLoan = async (req, res) => {

  try {
    const { amount, interest_rate, duration, socio_id } = req.body;

    if (!amount || !interest_rate || !duration || !socio_id) {
      return res
        .status(400)
        .json({ ok: false, msg: "Todos los campos son obligatorios." });
    }

    //validar si el socio asignado al prestamo existe
    const socio = await PartnerModel.getPartnerById(socio_id);
    if (!socio) {
      return res
        .status(404)
        .json({ ok: false, msg: "El socio asociado no existe." });
    }

    //crear prestamo
    const newLoan = await LoanModel.createLoan({
      amount,
      interest_rate,
      duration,
      socio_id,
    });
    return res.status(201).json({ ok: true, msg: newLoan });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al crear el préstamo." });
  }
};

//controlador para visualizar todos los prestamos
const getAllLoans = async (req, res) => {

  try {
    const loans = await LoanModel.getAllLoans();
    return res.status(200).json({ ok: true, msg: loans });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al obtener los préstamos." });
  }
};

//controlador para visualizar prestamo por ID
const getLoanById = async (req, res) => {

  try {
    const { pid } = req.params;
    const loan = await LoanModel.getLoanById(pid);

    if (!loan) {
      return res
        .status(404)
        .json({ ok: false, msg: "Préstamo no encontrado." });
    }

    return res.status(200).json({ ok: true, msg: loan });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al obtener el préstamo." });
  }
};

//controlador para actualizar prestamo
const updateLoan = async (req, res) => {

  try {
    const { pid } = req.params;
    const { amount, interest_rate, duration, socio_id } = req.body;

    //actualizar prestamo
    const updatedLoan = await LoanModel.updateLoan(pid, {
      amount,
      interest_rate,
      duration,
      socio_id,
    });

    //validar si existe
    if (!updatedLoan) {
      return res
        .status(404)
        .json({ ok: false, msg: "Préstamo no encontrado." });
    }

    return res.status(200).json({ ok: true, msg: updatedLoan });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al actualizar el préstamo." });
  }
};

//controlador para eliminar prestamo
const deleteLoan = async (req, res) => {

  try {
    const { pid } = req.params;

    const deletedLoan = await LoanModel.deleteLoan(pid);

    //validar si el prestamo existe
    if (!deletedLoan) {
      return res
        .status(404)
        .json({ ok: false, msg: "Préstamo no encontrado." });
    }

    return res
      .status(200)
      .json({ ok: true, msg: "Préstamo eliminado correctamente." });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Error al eliminar el préstamo." });
  }
};

//exportar controladores
export const LoanController = {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
};
