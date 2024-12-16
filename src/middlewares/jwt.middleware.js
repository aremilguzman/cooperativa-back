import jwt from "jsonwebtoken";

//Middleware para verificar token
export const protection = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  //hacer split en el token para omitir la palabra "bearer"
  token = token.split(" ")[1];

  //verificar token
  try {
    const { email, role_id, username } = jwt.verify(token, process.env.JWT_SECRET);

    req.email = email;
    req.role_id = role_id;
    req.username = username

    next();
  } catch (error) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    return res.status(400).json({ error: "Invalid Token" });
  }
};

//verificar si es admin
export const verifyAdmin = (req, res, next) => {
  if (req.role_id === 1) {
    return next();
  }

  return res.status(401).json({ error: "No estas autorizado" });
};
