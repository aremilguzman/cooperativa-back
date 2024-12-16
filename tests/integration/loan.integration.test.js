import request from "supertest";
import app from "../../index.js";
import bcrypt from "bcryptjs";
import { db } from "../../src/database/connection.js";

describe("Loan Integration Tests", () => {
  let token; // Token para autenticación
  let partnerId; // ID del socio asociado a los préstamos

  beforeAll(async () => {
    // Limpia la base de datos y reinicia IDs
    await db.query("TRUNCATE TABLE prestamos, socios, users, roles RESTART IDENTITY CASCADE");

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

    // Inserta un socio para asociar préstamos
    const partnerResponse = await db.query(
      `INSERT INTO socios (full_name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING sid`,
      ["John Doe", "john@example.com", "123456789", "123 Main St"]
    );
    partnerId = partnerResponse.rows[0].sid;
  });

  afterAll(async () => {
    await db.end();
  });

  it("should create a new loan", async () => {
    const loanData = {
      amount: 1000,
      interest_rate: 5.5,
      duration: 12,
      socio_id: partnerId,
    };

    const response = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${token}`)
      .send(loanData);

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(parseFloat(response.body.msg.amount)).toBe(1000);
  });

  it("should retrieve all loans", async () => {
    const response = await request(app)
      .get("/api/loans")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.msg)).toBe(true);
  });

  it("should retrieve a loan by ID", async () => {
    const response = await request(app)
      .get("/api/loans/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toHaveProperty("pid", 1);
  });

  it("should update a loan", async () => {
    const updatedLoanData = {
      amount: 1500,
      interest_rate: 6.0,
      duration: 18,
      socio_id: partnerId,
    };

    const response = await request(app)
      .put("/api/loans/1")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedLoanData);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(parseFloat(response.body.msg.amount)).toBe(1500);
  });

  it("should delete a loan", async () => {
    const response = await request(app)
      .delete("/api/loans/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toBe("Préstamo eliminado correctamente.");

    const getResponse = await request(app)
      .get("/api/loans/1")
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.status).toBe(404);
  });
});