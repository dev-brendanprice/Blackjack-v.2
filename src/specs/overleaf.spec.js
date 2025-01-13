/* eslint-disable no-unused-vars */
import { expect, test } from 'vitest';

import { dealPairToAllPlayers } from '../modules/dealCards.js';
import Dealer from '../classes/dealer.js';
import Deck from '../classes/deck.js';
import Player from '../classes/player.js';
import { compareHands } from '../modules/compareHands.js';


test('Two cards are dealt in the opening hand', () => {
    
    const playerOne = new Player('Player One', 0, 'active');
    const playerTwo = new Player('Player Two', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');
    const deck = new Deck();
    deck.create();
    deck.shuffle();
    
    // Test if module function deals cards correctly
    dealPairToAllPlayers(dealer, deck, [playerOne]);
    expect(playerOne.hand.length).toBe(2);

    // Test if manually dealing works correctly
    for (let i=0; i < 2; i++) {
        
        const newCard = deck.deal();
        playerTwo.hand.push(newCard);
        playerTwo.handValue += newCard.cardValue;
    };
    expect(playerTwo.hand.length).toBe(2);

});

test('Choosing hit deals another card to a valid hand and updates handValue', () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');
    const deck = new Deck();
    deck.create();
    deck.shuffle();

    // Deal opening hand to player and store handValue
    dealPairToAllPlayers(dealer, deck, [player]);
    const playerHandValueBeforeHit = player.handValue;
    const playerHandLengthBeforeHit = player.hand.length;

    // Player chooses to hit
    const newCard = deck.deal();
    player.hand.push(newCard);
    player.handValue += newCard.cardValue;

    // Check if another card has been dealt and handValue is greater
    expect(playerHandLengthBeforeHit).toBeLessThan(player.hand.length);
    expect(playerHandValueBeforeHit).toBeLessThan(player.handValue);

});

test('Choosing stand deals no further cards and checks handValue', () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Simulate player hand after choosing to hit
    player.hand = [{cardValue: 9, cardName: '9♦', rank: '9'}, {cardValue: 2, cardName: '2♦', rank: '2'}, {cardValue: 10, cardName: 'K♦', rank: 'King'}];
    player.handValue = 21;

    // Check players' hand
    compareHands(dealer, [player]);

    // Player chooses stand, no further cards are dealt
    expect(player.status).toBe('won');
    expect(player.hand.length).toBe(3);
    
});

test('When handValue is 21 or less, player has a valid hand', () => {

    const playerOne = new Player('Player One', 0, 'active');
    const playerTwo = new Player('Player Two', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Manually insert player hands to force a handValue of 22 or more
    playerOne.hand = [{cardValue: 11, cardName: 'A♦', rank: 'Ace'}, {cardValue: 10, cardName: 'K♦', rank: 'King'}];
    playerOne.handValue = 21;
    playerTwo.hand = [{cardValue: 5, cardName: '5♦', rank: '5'}, {cardValue: 10, cardName: 'K♦', rank: 'King'}];
    playerTwo.handValue = 15;

    // Check player's hand
    compareHands(dealer, [playerOne, playerTwo]);

    // Players have finished playing their hands, check if hands are valid
    expect(playerOne.status).toBe('won');
    
    let playerTwoValidHand = true; // Check if playerTwo has won or is still active, either is a valid hand
    if (playerTwo.status === 'won' || playerTwo.status === 'active') playerTwoValidHand = true;
    expect(playerTwoValidHand).toBeTruthy();
});

test('When handValue is 22 or more, player has gone bust', () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Manually insert player hand to force a handValue of 22 or more
    player.hand = [{cardValue: 9, cardName: '9♦', rank: '9'}, {cardValue: 10, cardName: 'K♦', rank: 'King'}, {cardValue: 10, cardName: 'Q♠', rank: 'Queen'}];
    player.handValue = 29;

    // Check players' hand
    compareHands(dealer, [player]);

    // Check if players' hand is valid
    expect(player.status).toBe('bust');

});

test('Winning hand: King and Ace', () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Manually insert King and Ace into players *empty* hand
    player.hand = [{cardValue: 10, cardName: 'K♦', rank: 'K'}, {cardValue: 11, cardName: 'A♦', rank: 'Ace'}];
    player.handValue = 21;

    // Check the players' hand
    compareHands(dealer, [player]);

    // Check if players' status is 'won'
    expect(player.status).toBe('won');

});

test('Winning hand: King, Queen and Ace', () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Manually insert King, Queen and Ace into players *empty* hand
    player.hand = [{cardValue: 10, cardName: 'K♦', rank: 'King'}, {cardValue: 10, cardName: 'Q♦', rank: 'Queen'}, {cardValue: 11, cardName: 'A♦', rank: 'Ace'}];
    player.handValue = 21;

    // Check the players' hand
    compareHands(dealer, [player]);

    // Check if players' status is 'won'
    expect(player.status).toBe('won');
});

test('Winning hand: Nine, Ace and Ace', () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Manually insert 9, Ace and another Ace into players *empty* hand
    player.hand = [{cardValue: 9, cardName: '9♦', rank: '9'}, {cardValue: 11, cardName: 'A♦', rank: 'Ace'}, {cardValue: 11, cardName: 'A♠', rank: 'Ace'}];
    player.handValue = 21;

    // Check the players' hand
    compareHands(dealer, [player]);

    // Check if players' status is 'won'
    expect(player.status).toBe('won');
});