
// if handValue is greater than 10, set first Ace value in hand to 1
export function assumeAceValues(entities) {

    for (let entity of entities) {

        const indexOfAce = entity.hand.findIndex(c => c.rank === 'Ace'); // Check for first Ace in hand
        if (indexOfAce >= 0) { // -1 means no Ace present
            entity.hand[indexOfAce].cardValue = 1
            entity.handValue = entity.hand.reduce((total, card) => total + card.cardValue, 0);
        };
    };
};