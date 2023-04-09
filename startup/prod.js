const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: [
        "https://vidly-app-six.vercel.app",
        "https://vidly-app-reiorozco.vercel.app",
        "https://vidly-app-git-master-reiorozco.vercel.app",
        "http://localhost:3000",
      ],
      credentials: true,
    })
  );
};
