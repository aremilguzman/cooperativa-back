import request from "supertest";
import app from "../../index.js";
import bcrypt from "bcryptjs";
import { db } from "../../src/database/connection.js";

describe("Tracking Integration Tests", () => {
  let token; // Token para autenticación
  let loanId; // ID del préstamo asociado a los seguimientos

  beforeAll(async () => {
    // Limpia la base de datos
    await db.query(
      "TRUNCATE TABLE seguimientos, prestamos, socios, users, roles RESTART IDENTITY CASCADE"
    );

    // Inserta roles
    const roles = await db.query(`
      INSERT INTO roles (name) VALUES ('ADMIN'), ('AGENT') RETURNING rid, name
    `);
    const adminRole = roles.rows.find((role) => role.name === "ADMIN");

    // Inserta un usuario administrador
    const hashedPassword = await bcrypt.hash("password123", 10);
    await db.query(
      `INSERT INTO users (email, password, username, role_id) VALUES ($1, $2, $3, $4)`,
      ["admin@example.com", hashedPassword, "admin", adminRole.rid]
    );

    // Autenticación para obtener token
    const loginResponse = await request(app).post("/api/users/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    token = loginResponse.body.msg.token;

    // Inserta un socio y préstamo
    const partnerResponse = await db.query(
      `INSERT INTO socios (full_name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING sid`,
      ["John Doe", "john@example.com", "123456789", "123 Main St"]
    );
    const partnerId = partnerResponse.rows[0].sid;

    const loanResponse = await db.query(
      `INSERT INTO prestamos (amount, interest_rate, duration, socio_id) VALUES ($1, $2, $3, $4) RETURNING pid`,
      [1000, 5.5, 12, partnerId]
    );
    loanId = loanResponse.rows[0].pid;
  });

  afterAll(async () => {
    await db.end();
  });

  it("should create a new tracking", async () => {
    const trackingData = {
      t_date: "2024-06-15",
      notas: "First follow-up",
      prestamo_id: loanId,
    };

    const response = await request(app)
      .post("/api/trackings")
      .set("Authorization", `Bearer ${token}`)
      .send(trackingData);

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
    const returnedDate = response.body.msg.t_date.split("T")[0];
    expect(returnedDate).toBe("2024-06-15");
  });

  it("should retrieve all trackings", async () => {
    const response = await request(app)
      .get("/api/trackings")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.msg)).toBe(true);
  });

  it("should retrieve a tracking by ID", async () => {
    const response = await request(app)
      .get("/api/trackings/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toHaveProperty("tid", 1);
  });

  it("should update a tracking", async () => {
    const updatedData = {
      t_date: "2024-06-20",
      status: "en proceso",
      notas: "Updated follow-up",
    };

    const response = await request(app)
      .put("/api/trackings/1")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toHaveProperty("status", "en proceso");
  });

  it("should delete a tracking", async () => {
    const response = await request(app)
      .delete("/api/trackings/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toBe("Seguimiento eliminado correctamente.");

    const getResponse = await request(app)
      .get("/api/trackings/1")
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.status).toBe(404);
  });
});