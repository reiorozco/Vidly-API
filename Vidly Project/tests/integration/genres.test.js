const request = require("supertest");
const { Genre } = require("../../models/GenreModel");
const { User } = require("../../models/UserModel");
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre3")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get(`/api/genres/1`);

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exits", async () => {
      const id = mongoose.Types.ObjectId();

      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = () => {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in ", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      name = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 21 characters", async () => {
      name = new Array(23).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it's valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it's valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let newName;
    let genre;
    let id;

    const exec = () => {
      return request(server)
        .put(`/api/genres/${id}`)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      genre = new Genre({ name: "12345" });
      await genre.save();

      token = new User().generateAuthToken();
      id = genre._id;
      newName = "updateName";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      newName = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is not a string", async () => {
      newName = 12345;

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id exits", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the genre it's valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("name", newName);
    });

    it("should return the updated genre it's valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name");
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    const exec = () => {
      return request(server)
        .delete(`/api/genres/${id}`)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ]);

      genre = await Genre.findOne({ name: "genre1" });
      id = genre._id.toHexString();

      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if no genre with the given id", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre it's valid", async () => {
      const res = await exec();

      const genres = await Genre.find({});

      expect(res.status).toBe(200);
      expect(genres.length).toBe(2);
      expect(genres.some((g) => g.name === "genre2")).toBeTruthy();
      expect(genres.some((g) => g.name === "genre3")).toBeTruthy();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
