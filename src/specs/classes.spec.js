/* eslint-disable no-unused-vars */
import { expect, test } from 'vitest';

import Deck from '../classes/deck.js';
import Player from '../classes/player.js';


test('Player: creates valid Player, getHand() work correctly', () => {

    const player = new Player('Brendan', 0, 'active');
    const deck = new Deck();
    deck.create();
    deck.shuffle();

    // Check if player is initialised with correct passed parameters/defaults
    expect({...player}).toStrictEqual({
        name: 'Brendan',
        handValue: 0,
        status: 'active',
        isDealer: false,
        statusChanged: false,
        statusAnnounced: false,
        hand: []
    });

    // Check if getHand() returns expected (specified cards)
    player.hand = [{cardValue: 11, cardName: 'A♦'}, {cardValue: 10, cardName: 'J♠'}];
    expect(player.getHand()).toBe('A♦, J♠');

    // Check if getHand() returns expected (specified cards, numbered)
    player.hand = [{cardValue: 5, cardName: '5♦'}, {cardValue: 8, cardName: '8♠'}];
    expect(player.getHand()).toBe('5♦, 8♠');

    // Check if getHand() returns expected (random cards)
    const firstRandomCard = deck.deal();
    const secondRandomCard = deck.deal();
    player.hand = [firstRandomCard, secondRandomCard];
    
    const simulatedGetHandReturn = `${firstRandomCard.cardName}, ${secondRandomCard.cardName}`;
    expect(player.getHand()).toBe(simulatedGetHandReturn);

});

test('Deck: creates 52 cards, shuffle(), and deal() work correctly', () => {

    const deck = new Deck();
    deck.create();

    const originalDeck = [...deck.cards]; // Duplicate deck before shuffle
    deck.shuffle();
    expect(deck.cards).toHaveLength(52);

    // Check if order of cards have changed (shuffled)
    const shuffledDeck = deck.cards;
    const hasOrderChanged = shuffledDeck.some((card, index) => card !== originalDeck[index]);
    expect(hasOrderChanged).toBe(true);

    // Check if shuffled deck has the same cards
    const originalSet = new Set(originalDeck);
    const shuffledSet = new Set(shuffledDeck);
    expect(originalSet).toEqual(shuffledSet);

    // Check if deal() removes dealt card from deck
    const deckBeforeDeal = [...deck.cards];
    const card = deck.deal();
    const deckAfterDeal = [...deck.cards];
    expect(deckBeforeDeal.length - 1).toBe(deckAfterDeal.length);
});

test('Deck: creates Cards with valid key:value pairs', () => {

    const deck = new Deck();
    deck.create();

    // Check scenarios for each card
    const expectedKeys = ['suit', 'rank', 'cardValue', 'cardName'];
    for (const card of deck.cards) {
        
        // Check if the expected keys are present 
        for (const key of expectedKeys) {
            expect(key in card).toBe(true);
        };

        // Type-check each value
        expect(typeof card.suit).toBe('string');
        expect(typeof card.rank).toBe('string');
        expect(typeof card.cardValue).toBe('number');
        expect(typeof card.cardName).toBe('string');

        // Check if each value is valid
        expect(deck.suits).toContain(card.suit);
        expect(deck.ranks).toContain(card.rank);

        expect(card.cardValue).greaterThanOrEqual(1);
        expect(card.cardValue).lessThanOrEqual(11);
        
        // Get first character and corresponding ASCII glpyh from suit
        const firstCharofRank = card.rank.split('')[0];
        const suitAscii = deck.suitAscii[deck.suits.indexOf(card.suit)];

        expect(card.cardName == `${firstCharofRank}${suitAscii}`).toBeTruthy();
    };
});

test('Deck: creates Deck with valid key:value pairs', () => {

    const deck = new Deck();

    // Check each equality of each key:value pair whilst also type-checking
    expect({...deck}).toStrictEqual({
        suits: ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
        ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'],
        suitAscii: ['♥', '♦', '♣', '♠'],
        cards: []
    });
});