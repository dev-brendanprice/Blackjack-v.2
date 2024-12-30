
// Check the status of a player, e.g. bust, won, push
export function checkPlayerStatus(player, playersArray) {

    switch (player.status) {
        
        case 'bust':
        case 'won':
        case 'push':

            // Remove player from array if won or bust
            let playerIndex = playersArray.indexOf(player);
            playersArray.splice(playerIndex, 1);
            break;
    };

    return player.status;
};