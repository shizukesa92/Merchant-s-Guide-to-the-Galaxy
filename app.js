const readline = require("readline");
const fs = require("fs");
const parser = require("./parser.js");

const myInterface = readline.createInterface({
	input: fs.createReadStream("./input.txt")
});

myInterface.on("line", line => {
	line = line.trim();
	parser.parseInput(line);
});
