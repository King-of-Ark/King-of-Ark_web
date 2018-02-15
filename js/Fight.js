class Fight {
	constructor(player, player1) {
		this.player = player;
		this.player1 = player1;
	}

	/*
		returns 1 if the first player wins
		-1 if the second player win
		0 for a draw
	*/
	getWinner() {
		// get the shorer count of action properties
		let maxRounds = this.player.actionProperties.length < this.player1.actionProperties.length ? this.player.actionProperties.length : this.player1.actionProperties.length;
		let round = 0;
		while(!this.player.isDead && !this.player1.isDead) {
			//as long as both have actionPropertys they 'fight against each other'
			if(round < maxRounds) {
				console.log("Round: " + round);
				console.log("Player 1 action/damage: " + this.player.actionProperties[round].action + "/" + this.player.actionProperties[round].damage);
				console.log("Player 2 action/damage: " + this.player1.actionProperties[round].action + "/" + this.player1.actionProperties[round].damage);


				if(this.player.actionProperties[round].winsAgainst(this.player1.actionProperties[round])) {
					console.log("Player 1 won");
					this.player1.health -= this.player.actionProperties[round].damage;

					if(this.player1.health <= 0) {
						this.player1.isDead = true;
						console.log("Player 2 died");
						return 1;
					} else {
						console.log("Player 2 health: " + this.player1.health)
					}
				} else if (this.player1.actionProperties[round].winsAgainst(this.player.actionProperties[round])) {
					console.log("Player 2 won");
					this.player.health -= this.player1.actionProperties[round].damage;

					if(this.player.health <= 0) {
						this.player.isDead = true;
						console.log("Player 1 died");
						return -1;
					} else {
						console.log("Player 1 health: " + this.player.health)
					}
				}

				round+=1;
			} else {
				//both players are still alive -> the player with more actionProperties can deal them 'for free' now.
				let restRounds = this.player.actionProperties.length > this.player1.actionProperties.length ? this.player.actionProperties.length - this.player1.actionProperties.length : this.player1.actionProperties.length - this.player.actionProperties.length;

				if(restRounds <= 0) {
					//both have an equal count of actionProperties
					console.log("No rest actionProperties to deal");
					break;
				} 

				for(let i=maxRounds; i<maxRounds+restRounds;i++) {
					//which player can deal his damage for free now ? 
					if(this.player.actionProperties.length > this.player1.actionProperties.length) {
						console.log("Player 1 dealing free damage to Player 2: " + this.player.actionProperties[i].damage);
						this.player1.health -= this.player.actionProperties[i].damage;

						if(this.player1.health <= 0) {
							this.player1.isDead = true;
							console.log("Player 2 died");
							return 1;
							break;
						}
					} else {
						console.log("Player 2 dealing free damage to Player 1: " + this.player1.actionProperties[i].damage);
						this.player.health -= this.player1.actionProperties[i].damage;

						if(this.player.health <= 0) {
							this.player.isDead = true;
							console.log("Player 1 died");
							return -1;
							break;
						}
					}
				}

				//both players are still alive -> end in a draw
				console.log("Fight ends with draw");
				return 0;
			}
		}
	}
}