class GameStatsTable {
    constructor() {
    }
    
    addPlayer(player) {
        let transactioID = player.id;
        let actionProperties = "";
        player.actionProperties.forEach(function(element) {
            actionProperties += element.symbol;
        });
        let health = player.health
        let healthRegen = player.healthRegen;
        $('#gameStatsTable tbody').append('<tr class="table-success"><td>'+ transactioID+'</td><td>' + actionProperties + '</td><td>' +health+ '</td><td>'+healthRegen+'</td></tr>');
    }
    
    setPlayerDead(playerID) {
        $('#gameStatsTable tbody tr').each(function() {

            //compare each cell to adjacent cells
            $(this).find('td').each(function() {
                var $val = $(this).text();

                if($val === playerID) {
                    $(this).parent().addClass('table-danger');
                }
            });
        });
    }
    
    setPlayerKing(playerID) {
        $('#gameStatsTable tbody tr').each(function() {

            //compare each cell to adjacent cells
            $(this).find('td').each(function() {
                var $val = $(this).text();

                if($val === playerID) {
                    $(this).parent().addClass('table-warning');
                }
            });
        });
    }
}
