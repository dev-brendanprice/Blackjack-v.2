import { askToRestartGame } from "./userInput.js";
import { roundData } from "../main.js";


// Append player status to player name
function appendStatusToName(player) {

    // Check if player status is *not* already visible
    if (!player.statusVisible) {
        player.name = `${player.name} (${player.status})`;
        player.statusVisible = true;
    };

    return player;
};


// Check the hand of a single player (OLD)
export async function checkHand(player, dealer, players) {

    let announcementArray = [];

    // If player busts
    if (player.handValue > 21) {

        // Check if player status has been announced before
        if (!player.statusAnnounced) {

            // Update player statuses, update endGameReason text
            player.status = 'bust';
            announcementArray.push(`${player.name} has gone bust`);
            player.statusAnnounced = true;
        };

        // Append player status to player name
        player = appendPlayerStatus(player);
    }

    // If dealer busts
    else if (dealer.handValue > 21 && roundData.isDealerFacedownCardShowing) { // isDealerFacedownCardShowing == True (facedown rule)
        
        // Update dealer status
        dealer.status = 'bust';
        announcementArray.push('Dealer has gone bust');

        // Append player status to player name
        dealer = appendPlayerStatus(dealer);

        // Update other player statuses
        player.status = 'won';
        
        // Ask user to restart game
        await askToRestartGame(players, dealer, announcementArray);
    }

    // If player and dealer push
    else if (player.handValue === dealer.handValue && roundData.isDealerFacedownCardShowing) { // isDealerFacedownCardShowing == True (facedown rule)

        // Check if player status has been announced before
        if (!player.statusAnnounced) {

            // Update player statuses, update endGameReason text
            player.status = 'push';
            announcementArray.push(`${player.name} has Pushed`);
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
            announcementArray.push(`${player.name} has a Blackjack!`);
            player.statusAnnounced = true;
        };

        // Append player status to player name
        player = appendPlayerStatus(player);
    }

    // If dealer wins
    else if (dealer.handValue === 21 && roundData.isDealerFacedownCardShowing) { // isDealerFacedownCardShowing == True (facedown rule)

        // Update dealer status
        dealer.status = 'won';
        announcementArray.push('Dealer has won their hand');

        // Append player status to player name
        dealer = appendPlayerStatus(dealer);

        // Update other player statuses
        player.status = 'lost';

        // Ask user to restart game
        await askToRestartGame(players, dealer, announcementArray);
    };

    // Append newlines and symbol to end and start of each announcementArray entry, type cast to String
    announcementArray = announcementArray.map(item => `> ${item}`);
    announcementArray = announcementArray.join('\n');
    
    return announcementArray;
};

// Check the hands of all players and the dealer, returns Array (REDUNDANT ??)
// export async function checkAllHands(players, dealer) {};