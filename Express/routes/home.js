const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
      <div>
        <h1>Hello World</h1>
        <button><a href="./api/courses">Go to the courses</a></button>
      </div>
    `);
});

module.exports = router;
