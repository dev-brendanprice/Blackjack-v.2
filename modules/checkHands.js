import { askToRestartGame } from "./userInput.js";
import { roundData } from "../main.js";


// Compare the hand of each player against the dealer and update statuses accordingly
export async function compareHands(dealer, players) {

    // Helper method to update status of a passed entity
    let anc = [];
    const updateStatus = (entity, status, message) => {
        entity.status = status;
        entity.statusChanged = true;
        anc.push(message);
    };

    for (let ply of players) {

        // if player is bust
        if (ply.handValue > 21) {
            updateStatus(ply, 'bust', `${ply.name} bust`);
        }
        
        // if player has pushed with dealer
        else if (ply.handValue === dealer.handValue) {
            updateStatus(ply, 'push', `${ply.name} push`);
        }

        // if player handValue is greater than dealer handValue or is 21
        else if (ply.handValue > dealer.handValue || ply.handValue === 21) {
            updateStatus(ply, 'won', `${ply.name} won`);
        }

        // if player handValue is lower than dealer handValue
        else if (ply.handValue < dealer.handValue && dealer.handValue <= 21) {
            updateStatus(ply, 'lost', `${ply.name} lost`);
        }
        
        // if dealer goes bust but player still has valid hand
        else if (ply.handValue <= 21 && dealer.handValue > 21) {
            updateStatus(ply, 'won', `${ply.name} won`);
        };
    };

    return anc.map(msg => `> ${msg}`).join('\n'); // return announcements prettified to String
};


// Check the hand of a single player
export async function checkHand(player, dealer, players) {

    let announcements = []; // Announces changes for player/dealer.status
    let facedownCardShowing = roundData.isDealerFacedownCardShowing;

    // Helper method to update status of a passed entity
    const updateStatus = (entity, status, message) => {

        // Only update status once
        if (!entity.statusChanged) {
            entity.status = status;
            // entity.name = `${entity.name} (${entity.status})`;
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