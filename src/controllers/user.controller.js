import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";

//controlador para registrar usuarios
const register = async (req, res) => {
  try {

    const { username, email, password } = req.body;
    
    //manejo de errores
    const errors = [];

    if (!username || username.trim().length < 3) {
      errors.push(
        "Nombre de usuario requerido y debe contener un minimo de 3 caracteres"
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("El formato del Email no es valido.");
    }

    if (!password || password.length < 8) {
      errors.push(
        "Contraseña es requerida y debe contener un minimo de 8 caracteres"
      );
    }

    // verificar si hay errores y devolver los mensajes
    if (errors.length > 0) {
      return res.status(400).json({
        ok: false,
        errors,
      });
    }

    //verificar si el usuario ya existe
    const user = await UserModel.findUserByEmail(email);
    if (user) {
      return res.status(409).json({ ok: false, msg: "Este email ya existe, intente con otro" });
    }

    //encriptación de password con saltos para evitar duplicidad
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //crear usuario
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      username,
    });

    return res.status(201).json({ ok: true, msg: newUser });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

//controlador de login
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    //manejo de errores
    const errors = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("El email no es valido.");
    }

    if (!password || password.trim() === "") {
      errors.push("La contraseña es requerida.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        ok: false,
        errors,
      });
    }

    //validar si existe el email en la BD
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Usuario no existe" });
    }

    //comparar contraseña encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    //se genera el token
    const token = jwt.sign(
      {
        email: user.email,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({ ok: true, msg: {
      token, 
      role_id: user.role_id
    } });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

//exportar controladores
export const UserController = {
  register,
  login,
};
