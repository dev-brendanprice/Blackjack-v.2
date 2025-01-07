
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

    players.pop(); // Remove dealer from players arr

    // [DEV] Force player(s) and dealer to get specific cards/handValue
    // players[0].hand = [{cardValue: 11, cardName: 'A♦'}, {cardValue: 10, cardName: 'J♠ [dev]'}];
    // players[0].handValue = 18;
    // players[1].hand = [{cardValue: 11, cardName: 'A♦'}, {cardValue: 10, cardName: 'J♠ [dev]'}];
    // players[1].handValue = 22;

    // dealer.hand = [{cardValue: 11, cardName: 'A♦'}, {cardValue: 10, cardName: 'J♠ [dev]'}];
    // dealer.handValue = 21;
};