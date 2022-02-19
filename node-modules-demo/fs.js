const fs = require("fs");

const files = fs.readdirSync("./");
console.log(files);

const filesAsync = fs.readdir("./", function (err, data) {
  if (err) console.log("Error: ", err);
  else console.log("Result: ", data);
});
