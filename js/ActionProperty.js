class ActionProperty {
	constructor(symbol, damage) {
		switch(symbol) {
			case 'R':
				this.action = "ROCK";
                this.symbol = 'R';
				break;
			case 'P':
				this.action = "PAPER";
                this.symbol = 'P';
				break;
			case 'S':
				this.action = "SCISSORS";
                this.symbol = 'S';
				break;
			case 'L':
				this.action = "LIZARD";
                this.symbol = 'L';
				break;
			case 'O':
				this.action = "SPOCK";
                this.symbol = 'S';
				break;
			case 'H':
				this.action = "HEALTH";
                this.symbol = 'H';
				break;
		}

		this.damage = damage
	}

	/*
		returns true if the action property have the same symbol/action
	*/
	isSame(otherActionProperty) {
		return this.action === otherActionProperty.action;
	}


	/*
		returns true if the current action property wins against the otherActionProperty actionProperty
		returns flase if it loses or draws
	*/
	winsAgainst(otherActionProperty) {
		if(this.action === "ROCK") {
			if(otherActionProperty.action === "SCISSORS" || otherActionProperty.action === "LIZARD" || otherActionProperty.action === "HEALTH") {
				return true;
			} 
		} else if(this.action === "PAPER") {
			if(otherActionProperty.action === "SPOCK" || otherActionProperty.action === "ROCK" || otherActionProperty.action === "HEALTH") {
				return true;
			} 
		} else if(this.action === "SCISSORS") {
			if(otherActionProperty.action === "PAPER" || otherActionProperty.action === "LIZARD" || otherActionProperty.action === "HEALTH") {
				return true;
			} 
		} else if(this.action === "LIZARD") {
			if(otherActionProperty.action === "PAPER" || otherActionProperty.action === "SPOCK" || otherActionProperty.action === "HEALTH") {
				return true;
			} 
		} else if(this.action === "SPOCK") {
			if(otherActionProperty.action === "SCISSORS" || otherActionProperty.action === "ROCK" || otherActionProperty.action === "HEALTH") {
				return true;
			} 
		} else if(this.action === "HEALTH") {
			return false; //H cant win
		}

		return false;
	}
}