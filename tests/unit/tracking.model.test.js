import { db } from "../../src/database/connection.js";
import { TrackingModel } from "../../src/models/tracking.model.js";
import { LoanModel } from "../../src/models/loan.model.js";
import { PartnerModel } from "../../src/models/partner.model.js";

describe("TrackingModel Unit Tests", () => {
  let loanId;

  beforeAll(async () => {
    await db.query("TRUNCATE TABLE seguimientos, prestamos, socios RESTART IDENTITY CASCADE");

    // Inserta un socio y préstamo
    const partner = await PartnerModel.createPartner({
      full_name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      address: "123 Main St",
    });

    const loan = await LoanModel.createLoan({
      amount: 1000,
      interest_rate: 5.5,
      duration: 12,
      socio_id: partner.sid,
    });

    loanId = loan.pid;
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

    const result = await TrackingModel.createTracking(trackingData);

    expect(result).toHaveProperty("tid");
    const returnedDate = new Date(result.t_date).toISOString().split("T")[0];
    expect(returnedDate).toBe("2024-06-15");
  });

  it("should retrieve all trackings", async () => {
    const result = await TrackingModel.getAllTrackings();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should retrieve a tracking by ID", async () => {
    const allTrackings = await TrackingModel.getAllTrackings();
    const tracking = allTrackings[0];

    const result = await TrackingModel.getTrackingById(tracking.tid);

    expect(result).toHaveProperty("tid", tracking.tid);
  });

  it("should update a tracking", async () => {
    const allTrackings = await TrackingModel.getAllTrackings();
    const tracking = allTrackings[0];

    const updatedData = {
      t_date: "2024-06-20",
      status: "en proceso",
      notas: "Updated follow-up",
    };

    const result = await TrackingModel.updateTracking(tracking.tid, updatedData);

    expect(result).toHaveProperty("status", "en proceso");
  });

  it("should delete a tracking", async () => {
    const allTrackings = await TrackingModel.getAllTrackings();
    const tracking = allTrackings[0];

    const result = await TrackingModel.deleteTracking(tracking.tid);
    expect(result).toHaveProperty("tid", tracking.tid);

    const deletedTracking = await TrackingModel.getTrackingById(tracking.tid);
    expect(deletedTracking).toBeUndefined();
  });
});