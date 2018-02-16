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
		this.isFighting = false;

		this.actionProperties = this.createActionProperties();
		this.nextActionpropertyIndex = 0; //index of the last used action property
		this.health = helper.getCharacterAppearance(this.transaction.getVendorField(), '+');
		this.maxHealth = this.health;
		this.healthRegen = helper.getCharacterAppearance(this.transaction.getVendorField(), '*');
		this.visionRange = 4;

		this.addAfterTurns = 5;
		this.addInTurn = 0;

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

	/*
		regenerate health based on the health regenaration (*)
	*/
	regenerateHealth() {
		this.health += this.healthRegen;

		if(this.health > this.maxHealth) {
			this.health = this.maxHealth;
		}

		console.log(this.id + ": regenerated " + this.healthRegen + " health. Health left = " + this.health);
	}

	/*
		Deals damage to the player
		returns true if the given damage 'killed' the player
	*/
	giveDamage(damage) {
		console.log(this.id + ": received " + damage + " damage. Health left = " + (this.health - damage));
		
		this.health -= damage;

		if(this.health <= 0) {
			this.health = 0;
			this.isDead = true;
			console.log(this.id + ": died!");
		} 

		return this.isDead;
	}

	move(newX, newY, fieldWidth, fieldHeight) {
		console.log(this.id + ": moves from " + this.x + "/" + this.y + " to: " + newX + "/" + newY);

		let helper = new Helper();

		this.x = newX;
		this.y = newY;
		this.graphic.x = helper.xFieldToPixels(newX, fieldWidth);
		this.graphic.y = helper.yFieldToPixels(newY, fieldHeight);
	}
}
