/* Case insensitivity assumption: All input is valid regardless of case, regex expression tests have included case-insitive modifiers just in case
 * Punctuation assumption: No input contains punctuations except for question input types */

/* A function which accepts Roman numerals as an argument, converts it into Arabic numerals and returns the converted numerals as value */
converter = (input) => {

	/* Unit test: Checks for validity of roman numeral combination */
	const validator = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/; /* Source: https://stackoverflow.com/questions/267399/how-do-you-match-only-valid-roman-numerals-with-a-regular-expression/5326535 */
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

/* Global object variables storing the values of galactic numerals and goods per unit */
var unit = {},
	good = {};

/* Main function exported to nodeJS which parses user input as a string argument, validifies if it falls under the 4 pre-defined types of input patterns, and logs an output to console only if it is one of the two query types */
exports.parseInput = (input) => {
	input = input.toUpperCase();
	inputLength = input.split(" ").length;

	/* Case 1: String input which assigns a roman numeral to a galactic numeral 
	 * Currency assignment syntax assumption: All galaxtic numerals are 1-word strings which correspond to 1-letter roman numeral separated by the word "is" */
	if (inputLength == 3) {

		/* Unit test: Checks for correct syntax */
		const validator = /^[A-Z]+\s+IS\s+[I|V|X|L|C|D|M]$/i;
		if (!input.match(validator)) {
			console.log("ERROR: Invalid assignment a galactic numeral to a roman numeral");
			return false;
		}

		input = input.split(" ");
		unit[input[0]] = input[2];
		return;
	}

	/* Case 2: Multiple word input defining the vaue of a galactic good 
	 * Good assignment syntax assumption: All goods contain one word and have integer values denoted by the word "credits" separated by the word "is" */
	if (inputLength > 3 && input.slice(4, 8) !== "MANY" && input.slice(4, 8) !== "MUCH") {

		/* Unit test: Checks for correct syntax */
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

		/* Unit test: Checks for correct syntax */
		const validator = /^HOW\s+MUCH\s+IS\s+([A-Z\s]+)[?]$/i;
		if (!(input.match(validator))) {
			console.log("ERROR: Invalid galactic numeral query syntax");
			return false;
		}

		const name = input.slice(12, -2);
		input = name.split(" ").map(galactic => unit[galactic]);

		/* Unit test: Checks if galactic numeral has been already been assigned a value */
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

		/* Unit test: Checks for correct syntax */
		const validator = /^HOW\s+MANY\s+CREDITS\s+IS\s+([A-Z\s]+)[?]$/i;
		if (!(input.match(validator))) {
			console.log("ERROR: Invalid good query syntax");
			return false;
		}

		var name = input.slice(20, -2),
			numerals = [];

		input = input.split(" ").slice(4, -1);

		/* Unit test: Checks if good has been already been assigned a value */
		if (good[input[input.length - 1]] === undefined) {
			console.log("ERROR: Undefined galactic good");
			return false;
		}

		const goods = good[input[input.length - 1]];
		input = input.slice(0, -1).map(galactic => unit[galactic]);

		/* Unit test: Checks if galactic numeral has been already been assigned a value */
		if (input.indexOf(undefined) !== -1) {
			console.log("ERROR: Undefined galactic numeral");
			return false;
		}

		input = input.join("");
		input = converter(input);
		console.log(name.toLowerCase() + " is " + input * goods + " Credits");
	}

	/* Handles inputs that do not fall under the 4 pre-defined categories and are not caught by the unit tests */
	console.log("I have no idea what you're talking about");
}
