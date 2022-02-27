const lib = require("../lib");
const db = require("../db");
const mail = require("../mail");

// Testing numbers
describe("absolute", () => {
  it("should return a positive number if input is positive", () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it("should return a positive number if input is negative", () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it("should return a positive number if input is zero", () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

// Testing strings
describe("greet", () => {
  it("should return the greeting message", () => {
    const result = lib.greet("Rei Orozco");
    expect(result).toMatch(/Rei Orozco/);
    expect(result).toContain("Rei Orozco");
  });
});

// Testing arrays
describe("getCurrencies", () => {
  it("should return supported currencies", () => {
    const result = lib.getCurrencies();

    // Too general
    expect(result).toBeDefined();
    expect(result).not.toBeNull();

    // Too specific
    expect(result[0]).toBe("USD");
    expect(result[1]).toBe("AUD");
    expect(result[2]).toBe("EUR");
    expect(result.length).toBe(3);

    //Proper way
    expect(result).toContain("USD");
    expect(result).toContain("AUD");
    expect(result).toContain("EUR");

    // Ideal way
    expect(result).toEqual(expect.arrayContaining(["EUR", "AUD", "USD"]));
    expect(new Set(result)).toContain("USD");
  });
});

// Testing objects
describe("getProduct", () => {
  it("should return the product the given id", () => {
    const result = lib.getProduct(1);

    // expect(result).toEqual({ id: 1, price: 10 });

    expect(result).toMatchObject({ id: 1, price: 10 });

    expect(result).toHaveProperty("id", 1);
  });
});

// Testing exceptions
describe("registerUser", () => {
  it("should throw if username is falsy", () => {
    const args = [null, undefined, NaN, "", 0, false];
    args.forEach((a) => expect(() => lib.registerUser(a)).toThrow());
  });

  it("should return a user object if valid username is passed", () => {
    const result = lib.registerUser("reiorozco");
    expect(result).toMatchObject({ username: "reiorozco" });
    expect(result.id).toBeGreaterThan(0);
  });
});

// Mock functions
describe("applyDiscount", () => {
  it("should apply 10% discount if customer has more than 10 points", () => {
    db.getCustomerSync = function (customerId) {
      console.log("Fake reading customer...");
      return { id: customerId, points: 20 };
    };

    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order);
    expect(order.totalPrice).toBe(9);
  });
});

// Mock functions
describe("notifyCustomer", () => {
  it("should send an email to the customer", () => {
    db.getCustomerSync = jest.fn().mockReturnValue({ email: "a" });
    mail.send = jest.fn();

    lib.notifyCustomer({ customerId: 1 });

    expect(mail.send).toHaveBeenCalled();
    expect(mail.send.mock.calls[0][0]).toBe("a");
    expect(mail.send.mock.calls[0][1]).toMatch(/order/);
  });
});
