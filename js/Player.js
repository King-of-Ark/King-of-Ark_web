class Player {
	/*
		create a player based on the passed transaction
	*/
	constructor(transaction) {
		let helper = new Helper();

		this.transaction = transaction;
		this.id = this.transaction.getId();

		this.isKing = false;
		this.isDead = false;

		this.actionProperties = this.createActionProperties();
		this.health = helper.getCharacterAppearance(this.transaction.getVendorField(), '+');

		this.x = this.getSpawnFieldX();
		this.y = this.getSpawnFieldY();
	}

	/*
		creates a pixi graphic for this object
	*/
	createGraphic(fieldWidth, fieldHeight) {
		this.graphic = new PIXI.Graphics();
	    this.graphic.beginFill(0x66CCFF);
	    this.graphic.drawRect(0, 0, fieldWidth, fieldHeight);
	    this.graphic.endFill();
	}

	/*
		Creates the action properties.
		The action properties define which actions of 'Rock Paper Scissors Lizard Spock' your entry uses, in which order and they damage they do.
	*/
	createActionProperties() {
		let helper = new Helper();

		let actionString = helper.getCharacters(this.transaction.getVendorField())
		let damageString = helper.getNumbers(this.transaction.getId())

		let actionProperties = [];
		for(let i=0; i<actionString.length; i++) {
			let actionProperty = new ActionProperty(actionString[i], helper.getIntRrangeFromString(damageString, i, 1))
			actionProperties.push(actionProperty);
		}

		return actionProperties;
	}

	/*
		The last 4 numbers in the transactionID of an entry define where the entry spawns on the battlefield 
		Example: as56df19de372bcdd245211e15c33c21sd123fsdf58f6cd20e4e6594531082 -> spawn at 10;82

		maxFieldsX: count of fields in x
	*/
	getSpawnFieldX() {
		let helper = new Helper();

		let numbersInTransactionID = helper.getNumbers(this.transaction.getId());
		return helper.getIntRrangeFromString(numbersInTransactionID, numbersInTransactionID.length - 4, 2);
	}

	/*
		maxFieldsY: count of fields in y
	*/
	getSpawnFieldY() {
		let helper = new Helper();

		let numbersInTransactionID = helper.getNumbers(this.transaction.getId());
		return helper.getIntRrangeFromString(numbersInTransactionID, numbersInTransactionID.length - 2, 2);
	}
}
