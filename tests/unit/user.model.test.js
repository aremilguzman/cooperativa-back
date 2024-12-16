import { db } from "../../src/database/connection.js";
import { UserModel } from "../../src/models/user.model.js";

describe("UserModel Unit Tests", () => {
  afterAll(async () => {
    await db.end(); // Cierra la conexión al terminar las pruebas
  });

  beforeEach(async () => {
    // Limpia las tablas 'users' y 'roles'
    await db.query("TRUNCATE TABLE users, roles RESTART IDENTITY CASCADE");
  
    // Inserta los roles requeridos
    await db.query("INSERT INTO roles (name) VALUES ('ADMIN'), ('AGENT')");
  });

  it("should create a new user", async () => {
    const userData = {
      email: "test@example.com",
      password: "hashedpassword123",
      username: "testuser",
      role_id: 1,
    };

    const result = await UserModel.create(userData);

    expect(result).toHaveProperty("email", "test@example.com");
    expect(result).toHaveProperty("username", "testuser");
    expect(result).toHaveProperty("uid");
  });

  it("should find a user by email", async () => {
    const email = "test@example.com";

    // Inserta un usuario para probar
    await UserModel.create({
      email,
      password: "hashedpassword123",
      username: "testuser",
      role_id: 1,
    });

    const result = await UserModel.findUserByEmail(email);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("email", email);
  });
});