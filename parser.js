/* Case insensitivity assumption: All input is valid regardless of case
 * Punctuation assumption: No input contains punctuations except for question input types */



/* A function which accepts Roman numerals as an argument, converts it into Arabic numerals and returns the converted numerals */

converter = (input) => {
	input = input.toUpperCase();

	/* Unit test: Checks for validity of roman numeral combination */
	const validator = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
	if (!input.match(validator)) {
		console.log("ERROR: Invalid roman numeral");
		return false;
	}

	var value = 0

	let arabic = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
		roman = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

	for (let x = 0; x <= arabic.length; x++) {
		while (input.indexOf(roman[x]) === 0) {
			value += arabic[x];
			input = input.replace(roman[x], "");
		}
	}
	return value;
}

/* Object variables storing the values of galactic numerals and goods per unit */
var unit = {

	},

	good = {

	};



/* Main function which parses user input as a string argument, validifies if it falls under the 4 pre-defined types of input patterns, and returns an output only if it is a query */

parseInput = (input) => {
	input = input.toUpperCase();
	inputLength = input.split(" ").length;

	/* Case 1: String input which assigns a roman numeral to a galactic numeral 
	 * Currency assignment syntax assumption: All galaxtic numerals are 1-word strings which correspond to 1-letter roman numeral separated by the word "is" */

	if (inputLength == 3) {
		const validator = /^[A-Z]+\s+IS\s+[I|V|X|L|C|D|M]$/i;
		if (!input.match(validator)) {
			console.log("ERROR: Invalid assignment a one-word galactic numeral to a one-word roman numeral");
			return false;
		}

		input = input.split(" ");
		unit[input[0]] = input[2];
		return;
	}

	/* Case 2: Multiple word input defining the vaue of a galactic good 
	 * Good assignment syntax assumption: All goods contain one word and have integer values denoted by the word "credits" separated by the word "is" */

	if (inputLength > 3 && input.slice(4, 8) !== "MANY" && input.slice(4, 8) !== "MUCH") {
		const validator = /^([A-Z\s]+)IS\s+(\d+.?\d*)\s+CREDITS/i;
		if (!input.match(validator)) {
			console.log("ERROR: Invalid assignment to multiple units of a galactic good");
			return false;
		}

		input = input.split(" ");
		currency = input[inputLength - 2];
		var units = [];
		while (input[0] in unit) {
			units.push(unit[input[0]]);
			input.shift();
		}
		units = units.join("");
		good[input[0]] = currency / converter(units);


		return;
	}

	/* Case 3: String query which expect a returned value of a galactic numeral
	 * Galactic numeral query syntax assumption: Second word is "MUCH" and query ends with " ?" (note whitespace) */
	if (input.slice(4, 8) == "MUCH") {

		const validator = /^HOW\s+MUCH\s+IS\s+([A-Z\s]+)[?]$/i;
		if (!(input.match(validator))) {
			console.log("ERROR: Invalid galactic numeral query syntax");
			return false;
		}

		const name = input.slice(12, -2);
		input = name.split(" ").map(galactic => unit[galactic]);

		if (input.indexOf(undefined) !== -1) {
			console.log("ERROR: Undefined galactic numeral");
			return false;
		}


		input = input.join("");
		input = converter(input);
		console.log(name.toLowerCase() + " is " + input);
		return;
	}

	/* Case 4: String query which expect a returned value of a number of units of a galactic good
	 * Galactic word query syntax assumption: Second word is "MANY" and query ends with " ?" (note whitespace) */
	if (input.slice(4, 8) == "MANY") {

		const validator = /^HOW\s+MANY\s+CREDITS\s+IS\s+([A-Z\s]+)[?]$/i;
		if (!(input.match(validator))) {
			console.log("ERROR: Invalid good query syntax");
			return false;
		}

		var name = input.slice(20, -2),
			numerals = [];

		input = input.split(" ").slice(4, -1);

		if (good[input[input.length - 1]] === undefined) {
			console.log("ERROR: Undefined galactic good");
			return false;
		}

		const goods = good[input[input.length - 1]];
		input = input.slice(0, -1).map(galactic => unit[galactic]);

		if (input.indexOf(undefined) !== -1) {
			console.log("ERROR: Undefined galactic numeral");
			return false;
		}

		input = input.join("");
		input = converter(input);

		console.log(name.toLowerCase() + " is " + input * goods + " Credits");

	}

}

parseInput("glob is I");
parseInput("prok is V");
parseInput("pish is X");
parseInput("tegj is L");
parseInput("glob glob Silver is 34 Credits");
parseInput("glob prok Gold is 57800 Credits");
parseInput("pish pish Iron is 3910 Credits");
parseInput("how much is pish tegj glob glob ?");
parseInput("how many Credits is glob prok Silver ?");
parseInput("how many Credits is glob prok Gold ?");
parseInput("how many Credits is glob prok Iron ?");
parseInput("how much wood could a woodchuck chuck if a woodchuck could chuck wood ?");
