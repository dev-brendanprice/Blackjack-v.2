import { assumeAceValues } from "./assumeAceValues.js";

export function dealPairToAllPlayers(dealer, deck, players) {

    const entities = [...players, dealer];
    const amountOfEntities = entities.length; // includes dealer
    const cardsPerPlayer = 2;
    for (let i=0; i < amountOfEntities*cardsPerPlayer; i++) {
        
        const entityIndex = i % amountOfEntities; // two cards per player by checking if counter is even
        const newCard = deck.deal();
        entities[entityIndex].hand.push(newCard);
        entities[entityIndex].handValue += newCard.cardValue;
    };

    insertHands(entities, false); // [dev] true means this function will insert hands
    assumeAceValues(entities); // Assume best Ace values
    return entities;
};

// Manually insert cards into hands for dev
function insertHands(entities, doWeInsertHands) {
    
    if (doWeInsertHands) { // Check if doWeInsertHands is true

        entities[0].hand = [{cardValue: 9, cardName: '9♦', rank: '9'}, {cardValue: 11, cardName: 'A♦', rank: 'Ace'}, {cardValue: 11, cardName: 'A♠', rank: 'Ace'}];
        entities[0].handValue = 31;
        return entities;
    };
    return entities;
};