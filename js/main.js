function main() {
    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    let fakeRequest = {
        id: "8a7bd89dbb6e8dc7dea3b1461e84538b724a0067d82eb1d682c2b1f4c28534fd",
        blockid: "339071738101246841",
        type: 0,
        timestamp: 16176515,
        amount: 100000000,
        fee: 10000000,
        vendorField: "PRLLL+++++++++++++++++++++++++++++++++++++++",
        senderId: "AZFz6Tf7KJQfzkfNDK93TavXJjUvb23xoa",
        recipientId: "AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR",
        senderPublicKex: "0304c7befdab0f64bf788d71c92dfe9213c54f13dbd9a64a91e21a834eb38139a4",
        signature: "3045022100a560de3b04438c9737fbd90bd2d41c173443bc2a00f47f447983110621ae33fd022005d7898a87fc97015aa9313ff4bf210243a087104825b765e2ec236bf00c39ae",
        asset: {},
        confirmations: 1514415
    }

    let fakeRequest1 = {
        id: "8a7bd89dbb6e8dc7dea3b1461e84538b724a0067d82eb1d682c2b1f4c4321fd",
        blockid: "339071738101246841",
        type: 0,
        timestamp: 16176515,
        amount: 100000000,
        fee: 10000000,
        vendorField: "OLR++++++++++++++++++++++++++++++++++",
        senderId: "AZFz6Tf7KJQfzkfNDK93TavXJjUvb23xoa",
        recipientId: "AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR",
        senderPublicKex: "0304c7befdab0f64bf788d71c92dfe9213c54f13dbd9a64a91e21a834eb38139a4",
        signature: "3045022100a560de3b04438c9737fbd90bd2d41c173443bc2a00f47f447983110621ae33fd022005d7898a87fc97015aa9313ff4bf210243a087104825b765e2ec236bf00c39ae",
        asset: {},
        confirmations: 1514415
    }

    let fakeRequest2 = {
        id: "as123ddsf34e8dc7dea3b1461e84538b724a0067d82eb1111111111",
        blockid: "339071738101246841",
        type: 0,
        timestamp: 16176515,
        amount: 100000000,
        fee: 10000000,
        vendorField: "RRRRRRRRRRR++++++++++++++++++++++++++++++++++",
        senderId: "AZFz6Tf7KJQfzkfNDK93TavXJjUvb23xoa",
        recipientId: "AZHXnQAYajd3XkxwwiL6jnLjtDHjtAATtR",
        senderPublicKex: "0304c7befdab0f64bf788d71c92dfe9213c54f13dbd9a64a91e21a834eb38139a4",
        signature: "3045022100a560de3b04438c9737fbd90bd2d41c173443bc2a00f47f447983110621ae33fd022005d7898a87fc97015aa9313ff4bf210243a087104825b765e2ec236bf00c39ae",
        asset: {},
        confirmations: 1514415
    }

    let fakeTransaction = new ArkTransaction(fakeRequest);
    let fakeTransaction1 = new ArkTransaction(fakeRequest1);
    let fakeTransaction2 = new ArkTransaction(fakeRequest2);

    let battlefield = new Battlefield(99,99,7,7);
    battlefield.create();

    //create path blockers
    //stones
    let helper = new Helper();
    let numbersInSignature = helper.getNumbers(fakeTransaction.getSignature());
    for(let i=0;i<numbersInSignature.length-4;i+=4) {
        let subNumberString = numbersInSignature.substr(i,4);
        let x = helper.getIntRrangeFromString(subNumberString,0,2);
        let y = helper.getIntRrangeFromString(subNumberString,2,2);

        if(x % 2 == 0) {
            battlefield.add(new Stone(x, y));
            battlefield.add(new Stone(x+1, y));
            battlefield.add(new Stone(x+2, y));
            battlefield.add(new Stone(x+3, y));
            battlefield.add(new Stone(x+4, y));
            battlefield.add(new Stone(x+5, y));
        } else {
            battlefield.add(new Stone(x, y));
            battlefield.add(new Stone(x, y+1));
            battlefield.add(new Stone(x, y+2));
            battlefield.add(new Stone(x, y+3));
            battlefield.add(new Stone(x, y+4));
            battlefield.add(new Stone(x, y+5));
        }
    }

    //add players
    battlefield.add(new Player(fakeTransaction));
    battlefield.add(new Player(fakeTransaction1));
    battlefield.add(new Player(fakeTransaction2));


    //start
    battlefield.start();
}