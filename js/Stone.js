class Stone {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/*
		creates a pixi graphic for this object
	*/
	createGraphic(fieldWidth, fieldHeight) {
		this.graphic = new PIXI.Graphics();
	    this.graphic.beginFill(0x000000);
	    this.graphic.drawRect(0, 0, fieldWidth, fieldHeight);
	    this.graphic.endFill();
	}
}