const { readFileSync } = require("fs/promises");
const path = require("path");

const buff = readFileSync(path.resolve(__dirname, "../src/router.ts"));

const content = buff.toString();

console.log({ content });
