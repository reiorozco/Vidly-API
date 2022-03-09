const { User } = require("../../../models/UserModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const config = require("../../../config/config");

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.JWT_PRIVATE_KEY);

    expect(decoded).toMatchObject(payload);
  });
});