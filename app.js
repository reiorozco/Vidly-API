const Logger = require("./logger");

function SayHello(name) {
  console.log(`Hello ${name}, good luck with Nodejs.`);
}

SayHello("Rei Orozco");

console.log(global);

console.log(module);

console.log(Logger);
const logger = new Logger();

logger.log("Prueba del require(import)");
