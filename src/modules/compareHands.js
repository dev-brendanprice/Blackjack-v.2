
// Compare the hand of each player against the dealer and update statuses accordingly
export async function compareHands(dealer, players = []) {

    // Helper method to update status of a passed entity
    let anc = [];
    const updateStatus = (entity, status, message) => {
        entity.status = status;
        entity.statusChanged = true;
        anc.push(message);
    };

    for (let ply of players) {

        // check if Player (ply) has a natural blackjack
        const playerNaturalBlackjack = ply.hand.length === 2 && ply.handValue === 21;
        const dealerNaturalBlackjack = dealer.hand.length === 2 && dealer.handValue === 21;

        // if player is bust
        if (ply.handValue > 21) {
            updateStatus(ply, 'bust', `${ply.name} bust`);
        }

        // if player has natural blackjack but dealer does not
        else if (playerNaturalBlackjack && !dealerNaturalBlackjack) {
            updateStatus(ply, 'won', `${ply.name} won, Blackjack!`);
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