class Helper {

	constructor() {}

	/*
		Returns all numbers from the given string
	*/
	getNumbers(string) {
		let result = "";
		let regex = /\d+/g
		let m;
		while ((m = regex.exec(string)) != null) {
		  result += m;
		}

		return result;
	}

	/*
		Returns all characters from the given string
	*/
	getCharacters(string) {
		let result = "";
		let regex = /[a-zA-Z]+/g
		let m;
		while ((m = regex.exec(string)) != null) {
		  result += m;
		}

		return result;
	}

	/*
		returns the amount of times a char apears in the string
	*/
	getCharacterAppearance(string, char) {
		let count = 0;
		for(let i = 0; i<string.length; count+=+(char===string[i++]));
		return count;
	}

	/*
		returns an int from a defined range of the string
	*/
	getIntRrangeFromString(string, startIndex, count) {
		return parseInt(string.substr(startIndex, count));

	}

}