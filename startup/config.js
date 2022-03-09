const config = require("../config/config");

module.exports = function () {
  // Json Web Token
  if (!config.JWT_PRIVATE_KEY) {
    throw new Error("FATAL ERROR: jwtPrivateKey isn't defined.");
  }
};
