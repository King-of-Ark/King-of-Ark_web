
var battlefield;

function main() {
    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    pullTransactions("DDngx2bLTDQ1mn1qwecsahfe6jGxn2KPhm", offset)
}

var offset = 0;
var receivedTransactions = []
function pullTransactions(walletAddress) {
	httpGetAsync("http://167.114.29.55:4002/api/transactions?recipientId=" + walletAddress + "&offset=" + offset, function callback(text) {
    	let json = JSON.parse(text);
    	receivedTransactions.push.apply(receivedTransactions, json.transactions);

    	offset += 50;
    	if(offset >= json.count) {
    		let helper = new Helper();

    		//init the battlefield
    		let numbersInWalletAddress = helper.getNumbers(walletAddress);
    		battlefield = new Battlefield(helper.getIntRrangeFromString(numbersInWalletAddress,0,2), helper.getIntRrangeFromString(numbersInWalletAddress,2,2), 10, 10);
    		//battlefield = new Battlefield(99, 99, 5, 5);
    		battlefield.create();

    		
    		//add the stones from the first entry
    		battlefield.createStones(new ArkTransaction(receivedTransactions[0]));		

    		//add the players
    		for(let i=0;i<receivedTransactions.length;i++) {
    			//only add transactions with a vendorField
    			if(receivedTransactions[i].vendorField != null) {
    				battlefield.add(new Player(new ArkTransaction(receivedTransactions[i])));
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