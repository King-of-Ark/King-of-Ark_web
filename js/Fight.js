class Fight {
	constructor(player1, player2) {
		this.player1 = player1;
		this.player2 = player2;
	}

	/*
		returns 1 if the first player wins
		-1 if the second player win
		0 for a draw
	*/
	getFightResult() {
		if(this.player1.nextActionpropertyIndex >= this.player1.actionProperties.length) {
			//player 1 is at the end of his action propertys
			//player 2 can deal his rest propertys for free on him
			console.log("Player 2 dealing free damage to Player 1");
			for(this.player2.nextActionpropertyIndex; this.player2.nextActionpropertyIndex<this.player2.actionProperties.length;this.player2.nextActionpropertyIndex++) {
				if(this.player1.giveDamage(this.player2.actionProperties[this.player2.nextActionpropertyIndex].damage)) {
					//Player 1 is dead -> player 2 won
					this.player2.nextActionpropertyIndex = 0;
					return -1;
				}
			}
			this.player1.nextActionpropertyIndex = 0;
			this.player2.nextActionpropertyIndex = 0;
		} else if(this.player2.nextActionpropertyIndex >= this.player2.actionProperties.length) {
			//player 2 is at the end of his action propertys
			//player 1can deal his rest propertys for free on him
			console.log("Player 1 dealing free damage to Player 2");
			for(this.player1.nextActionpropertyIndex; this.player1.nextActionpropertyIndex<this.player1.actionProperties.length;this.player1.nextActionpropertyIndex++) {
				if(this.player2.giveDamage(this.player1.actionProperties[this.player1.nextActionpropertyIndex].damage)) {
					//Player 2 is dead -> player 1 won
					this.player1.nextActionpropertyIndex = 0;
					return 1;
				}
			}
			this.player1.nextActionpropertyIndex = 0;
			this.player2.nextActionpropertyIndex = 0;
		} else {
			//both have action properties left.
			console.log("Player 1 action/damage: " + this.player1.actionProperties[this.player1.nextActionpropertyIndex].action + "/" + this.player1.actionProperties[this.player1.nextActionpropertyIndex].damage);
			console.log("Player 2 action/damage: " + this.player2.actionProperties[this.player2.nextActionpropertyIndex].action + "/" + this.player2.actionProperties[this.player2.nextActionpropertyIndex].damage);


			if(this.player1.actionProperties[this.player1.nextActionpropertyIndex].winsAgainst(this.player2.actionProperties[this.player2.nextActionpropertyIndex])) {
				console.log("Player 1 won");

				if(this.player2.giveDamage(this.player1.actionProperties[this.player1.nextActionpropertyIndex].damage)) {
					//Player 2 is dead -> player 1 won
					return 1;
				}
			} else if (this.player2.actionProperties[this.player2.nextActionpropertyIndex].winsAgainst(this.player1.actionProperties[this.player1.nextActionpropertyIndex])) {
				console.log("Player 2 won");

				if(this.player1.giveDamage(this.player2.actionProperties[this.player2.nextActionpropertyIndex].damage)) {
					//Player 1 is dead -> player 2 won
					return -1;
				} 
			}

			this.player1.nextActionpropertyIndex+=1;
			this.player2.nextActionpropertyIndex+=1;
		}

		//both players are still alive -> end in a draw
		return 0;
	}
}