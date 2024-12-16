import request from "supertest";
import app from "../../index.js";
import bcrypt from "bcryptjs";
import { db } from "../../src/database/connection.js";


describe("Partner Integration Tests", () => {
    let token; // Variable para almacenar el token

    beforeAll(async () => {
      // Limpia las tablas y reinicia los IDs
      await db.query("TRUNCATE TABLE socios, users, roles RESTART IDENTITY CASCADE");
  
      // Inserta los roles y guarda sus IDs
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
  
      // Inicia sesión para obtener el token
      const loginResponse = await request(app).post("/api/users/login").send({
        email: "admin@example.com",
        password: "password123",
      });
  
      // Guarda el token
      token = loginResponse.body.msg.token;
    });

  afterAll(async () => {
    await db.end();
  });

  it("should create a new partner", async () => {
    const partnerData = {
      full_name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      address: "123 Main St",
    };

    const response = await request(app)
      .post("/api/partners")
      .set("Authorization", `Bearer ${token}`)
      .send(partnerData);

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toHaveProperty("full_name", "John Doe");
  });

  it("should retrieve all partners", async () => {
    const response = await request(app)
      .get("/api/partners")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.msg)).toBe(true);
  });

  it("should retrieve a partner by ID", async () => {
    const response = await request(app)
      .get("/api/partners/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toHaveProperty("sid", 1);
  });

  it("should update a partner", async () => {
    const updatedData = {
      full_name: "Updated Partner",
      email: "updated@example.com",
      phone: "987654321",
      address: "456 Updated St",
    };

    const response = await request(app)
      .put("/api/partners/1")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toHaveProperty("full_name", "Updated Partner");
  });

  it("should delete a partner", async () => {
    const response = await request(app)
      .delete("/api/partners/1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.msg).toBe("Socio eliminado correctamente");

    const getResponse = await request(app)
      .get("/api/partners/1")
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.status).toBe(404);
  });
});