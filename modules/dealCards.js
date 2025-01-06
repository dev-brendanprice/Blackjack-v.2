
// Deal cards to players and dealer during game setup
export function dealCardsToAllPlayers(players, dealer, deck) {

    players.push(dealer); // Temp push dealer to players arr

    let cardsPerPlayer = 2; // Optional
    let playerCount = players.length;
    
    // Deal cards and update hand scores
    for (let i=0; i<playerCount * cardsPerPlayer; i++) {

        let index = i % playerCount;
        let card = deck.deal(); // Pull new card
        players[index].hand.push(card);
        players[index].handValue += card.cardValue;
    };

    // [DEV] Force specific player(s) to get cards
    // players[0].hand = [{cardValue: 11, cardName: '8♦'}, {cardValue: 10, cardName: '4♠ (fake)'}];
    // players[0].handValue = 21;
    // players[1].hand = [{cardValue: 11, cardName: '8♦'}, {cardValue: 10, cardName: '4♠ (fake)'}];
    // players[1].handValue = 22;
    // players[2].hand = [{cardValue: 11, cardName: '8♦'}, {cardValue: 10, cardName: '4♠ (fake)'}];
    // players[2].handValue = 18;
    // players[3].hand = [{cardValue: 11, cardName: '8♦'}, {cardValue: 10, cardName: '4♠ (fake)'}];
    // players[3].handValue = 15;

    players.pop(); // Remove dealer from players arr
};