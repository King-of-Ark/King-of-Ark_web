class Battlefield {

	/*
		width: [number of fields]
		height: [number of fields]
		fieldWidth: width of one field in [pixels]
		fieldHeight: height of one field in [pixels]
	*/
	constructor(width, height, fieldWidth, fieldHeight) {
		this.width = width;
		this.fieldWidth = fieldWidth;
		this.pixelWidth = this.width * this.fieldWidth;

		this.height = height;
		this.fieldHeight = fieldHeight;
		this.pixelHeight = this.height * this.fieldHeight;

		this.players = {};
		this.pathBlockers = {};


		this.ticker = 0;
		this.gameRound = 1; //counts the rounds of this game
		this.maxTurnsPerRound = 10;
		this.turnRounds = 1; //1 gameround consists of 10 turns

		this.gameRunning = false;
	}

	/*
		creates the pixi application
	*/
	create() {
		this.app = new PIXI.Application({width: this.pixelWidth, height: this.pixelHeight, backgroundColor: "0x6d6d6d"});

		let gameView = document.getElementById("gameView");
		//gameView.width = this.pixelWidth;
		//gameView.height = this.pixelHeight;
		gameView.appendChild(this.app.view);
	}

	/*
		Start the game loop by adding the `gameLoop` function to
  		Pixi's `ticker` and providing it with a `delta` argument.
	*/
	start() {
		this.app.ticker.add(delta => this.gameLoop(delta));
		this.gameRunning = true;
	}

	/*
		The main gameloop.
		Called with every frame
	*/
	gameLoop(delta){
		if(!this.gameRunning) {
			return;
		} else if(Object.keys(this.players).length <= 1) {
			console.log("Only King is left -> stoped the game!");
			this.gameRunning = false;
		}

		
		console.log("TURN: " + this.turnRounds + " ROUND: " + this.gameRound);

		if(this.turnRounds === 1) {
			//First turn!
			//Start with moving the players
			for(var player in this.players) {
				if(!this.players[player].isKing) {
					//move the players (except the king)
                    if(this.players[player].pathToKing === undefined || this.players[player].pathToKing.length <= 1) {
                        let pathToKing = this.getShortestPath(this.players[player], this.currentKing);
                        this.players[player].pathToKing = pathToKing;
                        if(this.isPlayerTraped(pathToKing)) {
                            //player is traped ->  bad luck for him -> he gets killed
                            this.killPlayer(this.players[player]);
                            console.log("player is traped ->  bad luck for him -> he gets killed");
                        } 
                    } else {
                        this.players[player].move(this.players[player].pathToKing[1][0], this.players[player].pathToKing[1][1], this.fieldWidth, this.fieldHeight);
                        this.players[player].pathToKing.shift(); 
                    }
				}
			}
		}

		//players start to fight or continue to fight
		for(var player in this.players) {
			if(!this.players[player].isKing) {
				// is there another player in range to attack ?
				let closestPlayerResult = this.getClosestPlayer(this.players[player]);
				if(closestPlayerResult.distance-2 < this.players[player].visionRange) {
					let closestPlayer = closestPlayerResult.player;

					let fight = new Fight(this.players[player], closestPlayer);
					let fightResult = fight.getFightResult();

					if(fightResult === 1 ) {
						//Do we have a new king ?
						if(closestPlayer.isKing) {
                            this.setPlayerKing(this.players[player]);
						}

                        this.players[player].kills += 1;
                        GameStatsTable.setPlayerKills(this.players[player].id, this.players[player].kills);
						this.killPlayer(closestPlayer);
					} else if(fightResult === -1){
						if(this.players[player].isKing) {
							closestPlayer.isKing = true;
							closestPlayer.lastUsedActionProperty = 0; //reset his action proeprties
							this.currentKing = closestPlayer;
						}

                        closestPlayer.kills += 1;
                        GameStatsTable.setPlayerKills(closestPlayer.id, closestPlayer.kills);
						this.killPlayer(this.players[player]);
					} 
				}
			}
		}

		//last turn -> regen health and increase counters
		if(this.turnRounds === this.maxTurnsPerRound) {
			for(var player in this.players) {
				this.players[player].regenerateHealth();
			}

			this.turnRounds = 1;
			this.gameRound += 1;
		} else {
			this.turnRounds += 1;
		}	
	}

	getClosestPlayer(comPlayer) {
		let closestPlayer = this.currentKing;
		let closesDistance = this.getDistance(comPlayer.x, comPlayer.y, this.currentKing.x, this.currentKing.y);

		for(var player in this.players) {
			if(this.players[player].id !== comPlayer.id) {
				let fieldsAway = this.getDistance(comPlayer.x, comPlayer.y, this.players[player].x, this.players[player].y);
				if(fieldsAway < closesDistance) {
					closestPlayer = this.players[player];
					closesDistance = fieldsAway;
				}
			}
		}

		return {"distance": closesDistance, "player": closestPlayer};
	}
    
    getDistance(x1, y1, x2, y2) {
        return Math.abs(x1-x2) + Math.abs(y1-y2);
    }

	/*
		check if a player is 'trapped'
		(there is no valid path to the current king)
	*/
	isPlayerTraped(pathToKing) {
		return pathToKing[1] == null;
	}

	/*
		kills the player and changes its appreance
	*/
	killPlayer(player) {
		this.remove(player);
		delete this.players[player.id];
        
        GameStatsTable.setPlayerDead(player.id);

		let deadBody = new DeadBody(player.x, player.y);
		this.add(deadBody);
	}
    
    /*
        sets the player to be the new king
    */
    setPlayerKing(player) {
        player.isKing = true;
        player.lastUsedActionProperty = 0; //reset his action proeprties
        this.currentKing = player;
        
        GameStatsTable.setPlayerKing(player.id);
    }

	/*
		returns the shortest path between two objects
		uses: https://github.com/qiao/PathFinding.js/
	*/
	getShortestPath(object, object1) {
	    var grid = new PF.Grid(this.width + 1, this.height + 1);

	    //add pathblockers
	    for(var blocker in this.pathBlockers) {
	    	grid.setWalkableAt(this.pathBlockers[blocker].x, this.pathBlockers[blocker].y, false);
	    }

	    //define the path finder
	    var finder = new PF.AStarFinder();

	    return finder.findPath(object.x, object.y, object1.x, object1.y, grid);
	}

	/*
		returns true if two objects are on the same field
	*/
	onSameField(object, object1) {
		return (object.x === object1.x && object.y === object1.y);
	}

	/*
		returns the number of fields object is away from object1
	*/
	numberOfFieldsAway(object, object1) {
		let path = this.getShortestPath(object, object1);
		return path.length;
	}

	/*
		adds a object to the battleground
	*/
	add(object) {
		object.createGraphic(this.fieldWidth, this.fieldHeight);

		//If the spawn point is outside the battlefield the entry spawns at the edge.
		//If the spawnpoint is on an pathBlocker it spawns near it
		object.x = this.findSpawnFieldX(object.x);
		object.y = this.findSpawnFieldY(object.y);
		
	    object.graphic.x = object.x * this.fieldWidth;
	    object.graphic.y = object.y * this.fieldHeight;
	    this.app.stage.addChild(object.graphic);

	    if(object.constructor.name === 'Player') {
	    	console.log(object.id + ": added to game");
	    	
	    	if(Object.keys(this.players).length === 0) {
                this.setPlayerKing(object);
	    	}
            
	    	this.players[object.id] = object;
            
            if(object.maxHealth <= 0) {
                this.killPlayer(object);
            }

	    } else if(object.constructor.name === 'Stone') {
	    	this.pathBlockers[Object.keys(this.pathBlockers).length] = object;
	    }
	}

	/*
		finds a falid spawn point for x
		If the spawn point is outside the battlefield the entry spawns at the edge.
		If the spawnpoint is on an pathBlocker it spawns near it
	*/
	findSpawnFieldX(objectX) {
		let newX
		if(objectX > this.width) {
			return this.width;
		} else {
			return objectX;
		}
	}

/*
		finds a falid spawn point for y
		If the spawn point is outside the battlefield the entry spawns at the edge.
		If the spawnpoint is on an pathBlocker it spawns near it
	*/
	findSpawnFieldY(objectY) {
		if(objectY > this.height) {
			return this.height;
		} else {
			return objectY;
		}
	}

	/*
		removes an object from the battlefield
	*/
	remove(object) {
		this.app.stage.removeChild(object.graphic);
	}

	/*
		creates stones and adds them to the battlefield
	*/
	createStones(transaction) {
		let helper = new Helper();
	    let numbersInSignature = helper.getNumbers(transaction.getSignature());
	    for(let i=0;i<numbersInSignature.length-4;i+=4) {
	        let subNumberString = numbersInSignature.substr(i,4);
	        let x = helper.getIntRrangeFromString(subNumberString,0,2);
	        let y = helper.getIntRrangeFromString(subNumberString,2,2);

	        if(x % 2 == 0) {
	            this.add(new Stone(x, y));
	            this.add(new Stone(x+1, y));
	            this.add(new Stone(x+2, y));
	            this.add(new Stone(x+3, y));
	            this.add(new Stone(x+4, y));
	            this.add(new Stone(x+5, y));
	        } else {
	            this.add(new Stone(x, y));
	            this.add(new Stone(x, y+1));
	            this.add(new Stone(x, y+2));
	            this.add(new Stone(x, y+3));
	            this.add(new Stone(x, y+4));
	            this.add(new Stone(x, y+5));
	        }
	    }
	}
}