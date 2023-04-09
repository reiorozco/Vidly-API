const request = require("supertest");
const { User } = require("../../models/UserModel");
const { Genre } = require("../../models/GenreModel");
const bcrypt = require("bcrypt");

let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../api");
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "invalidToken";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});

describe("/api/auth", () => {
  beforeEach(() => {
    server = require("../../api");
  });
  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  describe("POST /", () => {
    let user;
    let email;
    let password;
    let token;

    const exec = () => {
      return request(server).post("/api/auth").send({ email, password });
    };

    beforeEach(async () => {
      user = new User({
        name: "UserName",
        email: "correo@email.com",
        password: "password1234",
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();

      token = user.generateAuthToken();
      email = "correo@email.com";
      password = "password1234";
    });

    it("should return 400 if email send by user is invalid", async () => {
      email = "invalidEmail";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user email isn't found", async () => {
      email = "correo1234@email.com";

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email or password.");
    });

    it("should return 400 if password is wrong", async () => {
      password = "wrongPassword";

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email or password.");
    });

    it("should return the token if auth is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.text).toBe(token);
    });
  });
});
