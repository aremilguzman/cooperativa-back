import request from "supertest";
import app from "../../index.js";
import { db } from "../../src/database/connection.js";

describe("User Integration Tests", () => {
    let server;
  beforeAll(async () => {
    server = app.listen(0);
    await db.query("TRUNCATE TABLE users, roles RESTART IDENTITY CASCADE");
    await db.query("INSERT INTO roles (name) VALUES ('ADMIN'), ('AGENT')");
  });

  afterAll(async () => {
    await db.query("TRUNCATE TABLE users, roles RESTART IDENTITY CASCADE");
    await db.end();
    server.close();
  });

  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.ok).toBe(true);
      expect(response.body.msg).toHaveProperty("email", "testuser@example.com");
    });

    it("should not register a user with an existing email", async () => {
      await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/users/register").send({
        username: "otheruser",
        email: "testuser@example.com",
        password: "password456",
      });

      expect(response.status).toBe(409);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toBe("Este email ya existe, intente con otro");
    });
  });

  describe("POST /api/users/login", () => {
    it("should log in a user", async () => {
      await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/users/login").send({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.msg).toHaveProperty("token");
    });

    it("should return an error for invalid login", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Usuario no existe");
    });
  });
});