import { askToRestartGame } from "./userInput.js";
import { gameData } from './globalData.js';


// Check the hand of a single player
export async function checkHand(player, dealer, players) {

    let announcements = []; // Announces changes for player/dealer.status
    let facedownCardShowing = gameData.isDealerFacedownCardShowing;

    // Helper method to update status of a passed entity
    const updateStatus = (entity, status, message) => {

        // Only update status once
        if (!entity.statusChanged) {
            entity.status = status;
            entity.statusChanged = true;
            entity.statusAnnounced = true;
            announcements.push(message);
        };
    };


    // Conditions for possible outcomes
    if (player.handValue > 21) {

        // If player goes bust
        updateStatus(player, 'bust', `${player.name} has gone bust!`);
    }
    else if (dealer.handValue > 21 && facedownCardShowing) {

        // If dealer goes bust
        updateStatus(dealer, 'bust', 'The Dealer has gone bust!');
        updateStatus(player, 'won', `${player.name} has won their hand!`);
        await askToRestartGame(players, dealer, announcements);
    }
    else if (player.handValue === dealer.handValue && facedownCardShowing) {

        // If player pushes
        updateStatus(player, 'push', `${player.name} has pushed!`);
        let hasEveryPlayerPushed = players.every(plyr => plyr.handValue === dealer.handValue);

        // If the game is being played by one player (dealer also pushes)
        if (players.length === 1 || hasEveryPlayerPushed) {
            updateStatus(dealer, 'push', `The Dealer has pushed!`);
        };
    }
    else if (player.handValue === 21 && !facedownCardShowing) {

        // Check dealer facedown card for Blackjack in the case of a push
        if (player.handValue === 21) {
            updateStatus(player, 'won', `${player.name} has a Blackjack`);
        };
    }
    else if (player.handValue === 21 && facedownCardShowing) {

        // Check dealer facedown card for Blackjack in the case of a push
        if (player.handValue === 21) {
            updateStatus(player, 'won', `${player.name} has a Blackjack`);
        };

        if (dealer.handValue === 21 && player.every(plyr => plyr.handValue === 21)) {
            player.statusChanged = false;
            updateStatus(player, 'push', `${player.name} has pushed with a Blackjack`);
            // updateStatus(dealer, 'push', 'The Dealer has pushed with a Blackjack');
        };
    };
    // else if (dealer.handValue === 21 && facedownCardShowing) {

    //     // If dealer has a blackjack
    //     updateStatus(dealer, 'won', 'The Dealer has a Blackjack!');
    // };

    // Return the announcements to be rendered in the table
    return announcements.map(message => `> ${message}`).join('\n');
};