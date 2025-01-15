
// *Recursively* Sets Ace values to 1 when handValue exceeds 21
export function assumeAceValues(entities) {

    for (let entity of entities) {
        
        // Set each Ace to a cardValue of 1, if handValue exceeds 21
        while (entity.handValue > 21) {

            // Find the first Ace that has a cardValue of 11
            let aceFound = false;
            for (let card of entity.hand) {

                // Change the Ace's value to 1
                if (card.cardValue === 11) { // If card is ace and card hasnt been changed
                    card.cardValue = 1;
                    aceFound = true;
                    break;
                };
            };

            // Update entity handValue
            entity.handValue = entity.hand.reduce((total, card) => total + card.cardValue, 0);

            if (!aceFound) break; // Break while if no ace exists
        };
    };
};