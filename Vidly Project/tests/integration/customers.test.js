const { Customer } = require("../../models/CustomerModel");
const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../models/GenreModel");

let server;

describe("/api/customers", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Customer.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    const exec = () => {
      return request(server).get("/api/customers");
    };

    beforeEach(async () => {
      await Customer.collection.insertMany([
        {
          name: "Customer1",
          phone: "1234567890",
        },
        {
          name: "Customer2",
          phone: "1234567890",
        },
        {
          name: "Customer3",
          phone: "1234567890",
        },
      ]);
    });

    it("should return customers", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((c) => c.name === "Customer1"));
      expect(res.body.some((c) => c.name === "Customer2"));
      expect(res.body.some((c) => c.name === "Customer3"));
    });
  });

  describe("GET /:id", () => {
    let id;
    let customer;

    const exec = () => {
      return request(server).get(`/api/customers/${id}`);
    };

    beforeEach(async () => {
      customer = new Customer({
        name: "Customer",
        phone: "1234567890",
      });
      await customer.save();

      id = customer._id;
    });

    it("should return a genre if valid id is passed", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", customer.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      id = "invalidId";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exits", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let name;
    let phone;

    const exec = () => {
      return request(server).post("/api/customers").send({ name, phone });
    };

    beforeEach(() => {
      name = "Customer1";
      phone = "1234567890";
    });

    it("should return 400 if send invalid name", async () => {
      name = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if send invalid phone", async () => {
      phone = "invalidPhone";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return the customer if it's valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", name);
    });
  });

  describe("PUT /:id", () => {
    let isGold;
    let newName;
    let phone;
    let customer;
    let id;

    const exec = () => {
      return request(server)
        .put(`/api/customers/${id}`)
        .send({ isGold, name: newName, phone });
    };

    beforeEach(async () => {
      customer = new Customer({
        name: "Customer1",
        phone: "1234567890",
      });
      await customer.save();

      id = customer._id;
      isGold = true;
      newName = "updateName";
      phone = "0987654321";
    });

    it("should return 400 if send invalid name", async () => {
      newName = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = "invalidId";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no customer with the given id exits", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the customer it's valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("name", newName);
    });

    it("should return the updated customer it's valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name");
    });
  });

  describe("DELETE /:id", () => {
    let customer;
    let id;

    const exec = () => {
      return request(server).delete(`/api/customers/${id}`);
    };

    beforeEach(async () => {
      await Customer.collection.insertMany([
        {
          name: "Customer1",
          phone: "1234567890",
        },
        {
          name: "Customer2",
          phone: "1234567890",
        },
        {
          name: "Customer3",
          phone: "1234567890",
        },
      ]);

      customer = await Customer.findOne({ name: "Customer1" });
      id = customer._id.toHexString();
    });

    it("should return 404 if no customer with the given id", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if id is invalid", async () => {
      id = "invalidId";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the customer it's valid", async () => {
      const res = await exec();

      const customers = await Customer.find({});

      expect(res.status).toBe(200);
      expect(customers.length).toBe(2);
      expect(customers.some((g) => g.name === "Customer2")).toBeTruthy();
      expect(customers.some((g) => g.name === "Customer3")).toBeTruthy();
    });

    it("should return the removed customer", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", customer._id.toHexString());
      expect(res.body).toHaveProperty("name", customer.name);
    });
  });
});
