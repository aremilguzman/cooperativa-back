import { db } from "../../src/database/connection.js";
import { LoanModel } from "../../src/models/loan.model.js";
import { PartnerModel } from "../../src/models/partner.model.js";

describe("LoanModel Unit Tests", () => {
  let partnerId;

  beforeAll(async () => {
    await db.query("TRUNCATE TABLE prestamos, socios RESTART IDENTITY CASCADE");

    // Inserta un socio para los préstamos
    const partner = await PartnerModel.createPartner({
      full_name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      address: "123 Main St",
    });
    partnerId = partner.sid;
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

    const result = await LoanModel.createLoan(loanData);

    expect(result).toHaveProperty("pid");
    expect(parseFloat(result.amount)).toBe(1000); 
    expect(parseFloat(result.interest_rate)).toBe(5.5);
    expect(result).toHaveProperty("duration", 12);
    expect(result).toHaveProperty("socio_id", 1);
  });

  it("should retrieve all loans", async () => {
    const result = await LoanModel.getAllLoans();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should retrieve a loan by ID", async () => {
    const loans = await LoanModel.getAllLoans();
    const loan = loans[0];

    const result = await LoanModel.getLoanById(loan.pid);

    expect(result).toHaveProperty("pid", loan.pid);
    expect(result).toHaveProperty("amount", loan.amount);
  });

  it("should update a loan", async () => {
    const loans = await LoanModel.getAllLoans();
    const loan = loans[0];

    const updatedData = {
      amount: 1500,
      interest_rate: 6.0,
      duration: 18,
      socio_id: partnerId,
    };

    const result = await LoanModel.updateLoan(loan.pid, updatedData);

    expect(parseFloat(result.amount)).toBe(1500); 
    expect(parseFloat(result.interest_rate)).toBe(6.0); 
  });

  it("should delete a loan", async () => {
    const loans = await LoanModel.getAllLoans();
    const loan = loans[0];

    const result = await LoanModel.deleteLoan(loan.pid);
    expect(result).toHaveProperty("pid", loan.pid);

    const deletedLoan = await LoanModel.getLoanById(loan.pid);
    expect(deletedLoan).toBeUndefined();
  });
});