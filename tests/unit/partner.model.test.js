import { db } from "../../src/database/connection.js";
import { PartnerModel } from "../../src/models/partner.model.js";

describe("PartnerModel Unit Tests", () => {
  beforeAll(async () => {
    await db.query("TRUNCATE TABLE socios RESTART IDENTITY CASCADE");
  });

  afterAll(async () => {
    await db.end(); // Cierra la conexión a la base de datos
  });

  it("should create a new partner", async () => {
    const partnerData = {
      full_name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      address: "123 Main St",
    };

    const result = await PartnerModel.createPartner(partnerData);

    expect(result).toHaveProperty("sid");
    expect(result).toHaveProperty("full_name", "John Doe");
    expect(result).toHaveProperty("email", "john@example.com");
  });

  it("should retrieve all partners", async () => {
    const result = await PartnerModel.getAllPartners();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should retrieve a partner by ID", async () => {
    const allPartners = await PartnerModel.getAllPartners();
    const partner = allPartners[0];

    const result = await PartnerModel.getPartnerById(partner.sid);

    expect(result).toHaveProperty("sid", partner.sid);
    expect(result).toHaveProperty("email", partner.email);
  });

  it("should update a partner", async () => {
    const allPartners = await PartnerModel.getAllPartners();
    const partner = allPartners[0];

    const updatedData = {
      full_name: "John Updated",
      email: "updated@example.com",
      phone: "987654321",
      address: "456 Updated St",
    };

    const result = await PartnerModel.updatePartner(partner.sid, updatedData);

    expect(result).toHaveProperty("full_name", "John Updated");
    expect(result).toHaveProperty("email", "updated@example.com");
  });

  it("should delete a partner", async () => {
    const allPartners = await PartnerModel.getAllPartners();
    const partner = allPartners[0];

    const result = await PartnerModel.deletePartner(partner.sid);
    expect(result).toHaveProperty("sid", partner.sid);

    const deletedPartner = await PartnerModel.getPartnerById(partner.sid);
    expect(deletedPartner).toBeUndefined();
  });
});