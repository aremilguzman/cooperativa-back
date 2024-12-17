import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger.json";
const endPointsFiles = ["./index.js"];

const doc = {
  info: {
    title: "API de crud para cooperativa",
    description:
      "Esta API permite gestionar socios, prestamos y seguimientos mediante autenticacion de usuarios con roles definidos",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

swaggerAutogen()(outputFile, endPointsFiles, doc);
