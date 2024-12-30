import { askToRestartGame } from "./userInput.js";
import { roundData } from "../main.js";


// Append player status to player name
function appendPlayerStatus(player) {

    // Check if player status is *not* already visible
    if (!player.statusVisible) {
        player.name = `${player.name} (${player.status})`;
        player.statusVisible = true;
    };

    return player;
};


// Check the hands of all players and the dealer
export async function checkHands(players, dealer) {

    let endGameReason = '';

    for (let player of players) {

        // If player busts
        if (player.handValue > 21) {

            // Check if player status has been announced before
            if (!player.statusAnnounced) {

                // Update player statuses, update endGameReason text
                player.status = 'bust';
                endGameReason = `${player.name} has gone bust`;
                player.statusAnnounced = true;
            };

            // Append player status to player name
            player = appendPlayerStatus(player);
        }

        // If dealer busts
        else if (dealer.handValue > 21 && roundData.roundNumber > 0) { // Is not dealer facedown round (round zero)
            
            // Update dealer status
            dealer.status = 'bust';
            endGameReason = 'Dealer has gone bust';

            // Append player status to player name
            dealer = appendPlayerStatus(dealer);

            // Update other player statuses
            player.status = 'won';
            
            // Ask user to restart game
            await askToRestartGame(players, dealer, endGameReason);
        }

        // If player and dealer push
        else if (player.handValue === dealer.handValue && roundData.roundNumber > 0) { // Is not dealer facedown round (round zero)

            // Check if player status has been announced before
            if (!player.statusAnnounced) {

                // Update player statuses, update endGameReason text
                player.status = 'push';
                endGameReason = `${player.name} has Pushed`;
                player.statusAnnounced = true;
            };

            // Append player status to player name
            player = appendPlayerStatus(player);

            // If there is only one player then push dealer also
            if (players.length === 1) {
                dealer.status = 'push'
                appendPlayerStatus(dealer); // Append player status to player name
            };
        }

        // If player wins
        else if (player.handValue === 21) {

            // Check if player status has been announced before
            if (!player.statusAnnounced) {

                // Update player statuses, update endGameReason text
                player.status = 'won';
                endGameReason = `${player.name} has a Blackjack!`;
                player.statusAnnounced = true;
            };

            // Append player status to player name
            player = appendPlayerStatus(player);
        }

        // If dealer wins
        else if (dealer.handValue === 21 && roundData.roundNumber > 0) { // Is not dealer facedown round (round zero)

            // Update dealer status
            dealer.status = 'won';
            endGameReason = 'Dealer has won their hand';

            // Append player status to player name
            dealer = appendPlayerStatus(dealer);

            // Update other player statuses
            player.status = 'lost';
            console.log(player);

            // Ask user to restart game
            await askToRestartGame(players, dealer, endGameReason);
        };
    };
    
    return endGameReason;
};