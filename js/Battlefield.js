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
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	/*
		creates the pixi application
	*/
	create() {
		this.app = new PIXI.Application({width: this.pixelWidth, height: this.pixelHeight, backgroundColor: "0x6d6d6d"});
		document.body.appendChild(this.app.view);
	}

	/*
		Start the game loop by adding the `gameLoop` function to
  		Pixi's `ticker` and providing it with a `delta` argument.
	*/
	start() {
		this.app.ticker.add(delta => this.gameLoop(delta));
	}

	/*
		The main gameloop.
		Called with every frame
	*/
	gameLoop(delta){
		for(var player in this.players) {
			if(!this.players[player].isKing && !this.players[player].isDead) {
				//move the players (except the king)
				let pathToKing = this.getShortestPath(this.players[player], this.currentKing);
				if(pathToKing[1] == null) {
					//player is traped ->  bad luck for him -> he gets killed
					this.killPlayer(player);
					console.log("player is traped ->  bad luck for him -> he gets killed");
				} else {
					this.players[player].x = pathToKing[1][0];
					this.players[player].y = pathToKing[1][1];
					this.players[player].graphic.x = this.xFieldToPixels(this.players[player].x);
					this.players[player].graphic.y = this.yFieldToPixels(this.players[player].y);

					//fight ?
					if(this.numberOfFieldsAway(this.players[player], this.currentKing) <= 4) {
						let fight = new Fight(this.players[player], this.currentKing);
						let fightResult = fight.getWinner();

						//Do we have a new king ?
						if(fightResult === 1) {
							this.killPlayer(this.currentKing.id);
							this.players[player].isKing = true;
							this.currentKing = this.players[player];
						} else if(fightResult === -1){
							this.killPlayer(player);
						} else {
							//draw
						}
					}
				}
			}
		}
	}

	/*
		kills the player and removes him from the battlefield
	*/
	killPlayer(playerId) {
		this.remove(this.players[playerId]);
		delete this.players[playerId];
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
		calculates the starting x in pixel based on the field x index
	*/
	xFieldToPixels(index) {
		return index * this.fieldWidth;
	}

	/*
		calculates the starting y in pixel based on the field y index
	*/
	yFieldToPixels(index) {
		return index * this.fieldHeight;
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
	    	if(Object.keys(this.players).length === 0) {
	    		object.isKing = true;
	    		this.currentKing = object;
	    	}

	    	this.players[object.id] = object;	
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
}