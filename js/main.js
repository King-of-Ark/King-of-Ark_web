
var battlefield;

function main(gameStats) {
    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    pullTransactions("DDngx2bLTDQ1mn1qwecsahfe6jGxn2KPhm", offset)
}

var offset = 0;
var receivedTransactions = []
function pullTransactions(walletAddress) {
	httpGetAsync("https://dexplorer.ark.io:8443/api/transactions?recipientId=" + walletAddress + "&offset=" + offset, function callback(text) {
    	let json = JSON.parse(text);
    	receivedTransactions.push.apply(receivedTransactions, json.transactions);

    	offset += 50;

    	if(offset >= json.count || json.count === undefined) {
    		let helper = new Helper();

    		//init the battlefield
    		battlefield = new Battlefield(100, 100, 8, 8);
    		battlefield.create();
    		
    		//add the stones from the first entry
            alert(receivedTransactions[0]);
    		battlefield.createStones(new ArkTransaction(receivedTransactions[0]));		

    		//add the players to the battlefield and to the gameStats
            let gameStatsTable = new GameStatsTable();
    		for(let i=0;i<receivedTransactions.length;i++) {
    			//only add transactions with a vendorField
    			if(receivedTransactions[i].vendorField != null) {
                    let player = new Player(new ArkTransaction(receivedTransactions[i]));
                    gameStatsTable.addPlayer(player);
    				battlefield.add(player);
    			}
    		}
    		
    		battlefield.start();
    	} else {
    		pullTransactions(walletAddress);
    	}
    });
}


function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
