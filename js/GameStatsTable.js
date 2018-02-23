class GameStatsTable {
    constructor() {
    }
    
    addPlayer(player) {
        let transactioID = player.id;
        let actionProperties = "";
        player.actionProperties.forEach(function(element) {
            actionProperties += element.symbol;
        });
        let kills = player.kills;
        let currentHealth = player.health;
        let maxHealth = player.maxHealth;
        let healthRegen = player.healthRegen;
        
        let table = document.getElementById("gameStatsTable");
        let row = table.insertRow(table.rows.length);
        row.className = "table-success";
        row.id = transactioID;
        
        let idCell = row.insertCell(0);
        idCell.innerHTML = "TODO";
        
        let propCell = row.insertCell(1);
        propCell.innerHTML = "";
        for(let i=0; i<player.actionProperties.length;i++) {
            if(player.actionProperties[i].action !== "HEALTH") {
                propCell.innerHTML += "<font color='"+GameStatsTable.getHeathmapColor(player.actionProperties[i].damage)+"'> "+player.actionProperties[i].symbol+"</font>";
            } else {
                propCell.innerHTML += "<font color='#979899'>" + player.actionProperties[i].symbol + "</font>";
            }
        }
        
        let killCell = row.insertCell(2);
        killCell.innerHTML = kills
        
        let healthCell = row.insertCell(3);
        healthCell.innerHTML = currentHealth + "/" + maxHealth;
        
        let regenCell = row.insertCell(4);
        regenCell.innerHTML = healthRegen;
        //$('#gameStatsTable tbody').append('<tr id='+transactioID+' class="table-success"><td>'+ transactioID+'</td><td>' + actionProperties + '</td><td>' + kills+ '</td><td>' +currentHealth + "/" + maxHealth+ '</td><td>'+healthRegen+'</td></tr>');
    }
    
    static setPlayerDead(playerID) {
        let table = document.getElementById("gameStatsTable");
        let row = table.rows.namedItem(playerID);
        row.className = 'table-danger';
    }
    
    static setPlayerKing(playerID) {
        let table = document.getElementById("gameStatsTable");
        let row = table.rows.namedItem(playerID);
        row.className = 'table-warning';
    }
    
    static setPlayerKills(playerID, kills) {
        let table = document.getElementById("gameStatsTable");
        let cells = table.rows.namedItem(playerID).cells;
        cells[2].innerHTML = kills;
    }
    
    static setPlayerHealth(playerID, currentHealth, maxHealth) {
        let table = document.getElementById("gameStatsTable");
        let cells = table.rows.namedItem(playerID).cells;
        cells[3].innerHTML = currentHealth + "/" + maxHealth;
    }

    /*
        returns a color for a number between 0 and 9
        0 lowest value
        9 highest value
    */
    static getHeathmapColor(number) {
        switch(number) {
            case 0: return "#99c2ff";
            case 1: return "#66a3ff";
            case 2: return "#3385ff";
            case 3: return "#0066ff";
            case 4: return "#0052cc";
            case 5: return "#ffad99";
            case 6: return "#ff8566";
            case 7: return "#ff5c33";
            case 8: return "#ff3300";
            case 9: return "#cc2900";
        }
    }
}
