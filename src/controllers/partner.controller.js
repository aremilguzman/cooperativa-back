import { PartnerModel } from "../models/partner.model.js";

//Controlador para crear socios
const createPartner = async (req, res) => {

  try {
    const { full_name, email, phone, address } = req.body;

    //Validacion de campos
    if (!full_name || !email || !phone || !address) {
      return res
        .status(400)
        .json({ ok: false, msg: "Todos los campos son obligatorios" });
    }

    //Crear socio
    const newPartner = await PartnerModel.createPartner({
      full_name,
      email,
      phone,
      address,
    });
    return res.status(201).json({ ok: true, msg: newPartner });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

//Controlador para ver listado de socios
const getAllPartners = async (req, res) => {

  try {
    const partners = await PartnerModel.getAllPartners();
    return res.status(200).json({ ok: true, msg: partners });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

//Controlador para encontrar socio por ID
const getPartnerById = async (req, res) => {

  try {
    const { sid } = req.params;
    const partner = await PartnerModel.getPartnerById(sid);

    if (!partner) {
      return res.status(404).json({ ok: false, msg: "Socio no encontrado" });
    }

    return res.status(200).json({ ok: true, msg: partner });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

//Controlador para actualizar socio
const updatePartner = async (req, res) => {

  try {
    const { sid } = req.params;
    const { full_name, email, phone, address } = req.body;

    const updatedPartner = await PartnerModel.updatePartner(sid, {
      full_name,
      email,
      phone,
      address,
    });

    if (!updatedPartner) {
      return res.status(404).json({ ok: false, msg: "Socio no encontrado" });
    }

    return res.status(200).json({ ok: true, msg: updatedPartner });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

//Controlador para borrar socios
const deletePartner = async (req, res) => {

  try {
    const { sid } = req.params;
    const deletedPartner = await PartnerModel.deletePartner(sid);

    if (!deletedPartner) {
      return res.status(404).json({ ok: false, msg: "Socio no encontrado" });
    }

    return res.status(200).json({ ok: true, msg: "Socio eliminado correctamente" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

//exportar controladores
export const PartnerController = {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
};
