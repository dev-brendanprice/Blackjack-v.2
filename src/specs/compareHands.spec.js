/* eslint-disable no-unused-vars */
import { expect, test } from 'vitest';

import { compareHands } from '../modules/compareHands.js';
import Player from '../classes/player.js';
import Dealer from '../classes/dealer.js';


test('compareHands: Edge case scenarios', async () => {

    const dealer = new Dealer('Dealer', 0, 'active');
    const players = [];

    // Create 2 players
    for (let i=0; i<2; i++) {
        const plyr = new Player(`Player ${i}`, 0, 'active');
        players.push(plyr);
    };

    // Edge Case: Empty players array
    const emptyArray = [];
    let functionResponse;

    await compareHands(dealer, emptyArray)
    .then(res => { functionResponse = res })
    .catch(err => { functionResponse = err });

    expect(functionResponse).toBeTypeOf('string'); // Returns string
    expect(functionResponse instanceof Error).toBe(false); // Does not return error

    // Edge Case: Only dealer is provided
    await compareHands(dealer)
    .then(res => { functionResponse = res })
    .catch(err => { functionResponse = err });

    // Check if compareHands function response is not an Error object
    expect(functionResponse).toBeTypeOf('string');
    expect(functionResponse instanceof Error).toBe(false);

    // Edge Case: statusChanged is set to True for each updated Player
    await compareHands(dealer, players);
    for (const plyr of players) {

        // All players should push because; handValue == 0 for all Players and Dealer here
        expect(plyr.status).toBe('push');
        expect(plyr.statusChanged).toBe(true);
    };
});

test('compareHands: Player busts', async () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');
    
    // Check if Player goes bust when handValue is greater than 21
    player.hand = [{cardValue: 10, cardName: 'J♦'}, {cardValue: 10, cardName: 'J♠'}, {cardValue: 10, cardName: 'J♣'}];
    player.handValue = 30;

    let anc = await compareHands(dealer, [player]); // anc = returned announcements string
    
    expect(anc).toBe('> Player bust');
    expect(player.status).toBe('bust');
    expect(player.statusChanged).toBeTruthy();
    expect(player.handValue).toBeGreaterThan(21);

});

test('compareHands: Player pushes to Dealer', async () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Check if player pushes when player.handValue == dealer.handValue
    player.hand = [{cardValue: 5, cardName: '5♦'}, {cardValue: 10, cardName: 'J♠'}];
    player.handValue = 15;
    dealer.hand = [{cardValue: 5, cardName: '5♦'}, {cardValue: 10, cardName: 'J♠'}];
    dealer.handValue = 15;

    let anc = await compareHands(dealer, [player]);

    expect(anc).toBe('> Player push');
    expect(player.status).toBe('push');
    expect(player.statusChanged).toBeTruthy();
    expect(player.handValue).toBe(dealer.handValue);
});

test('compareHands: Player wins via Higher handValue', async () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Check if player wins when their handValue is high than the dealers handValue
    player.hand = [{cardValue: 5, cardName: '5♦'}, {cardValue: 10, cardName: 'J♠'}, {cardValue: 5, cardName: '5♠'}];
    player.handValue = 20;
    dealer.hand = [{cardValue: 8, cardName: '8♦'}, {cardValue: 10, cardName: 'J♠'}];
    dealer.handValue = 18;

    let anc = await compareHands(dealer, [player]);

    expect(anc).toBe('> Player won');
    expect(player.status).toBe('won');
    expect(player.statusChanged).toBeTruthy();
    expect(player.handValue).toBeGreaterThan(dealer.handValue);
});

test('compareHands: Player wins via 21', async () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Check if player wins when their handValue is exactly 21
    player.hand = [{cardValue: 10, cardName: '10♦'}, {cardValue: 10, cardName: 'J♠'}, {cardValue: 1, cardName: 'A♠'}];
    player.handValue = 21;
    dealer.hand = [{cardValue: 8, cardName: '8♦'}, {cardValue: 10, cardName: 'J♠'}];
    dealer.handValue = 18;

    let anc = await compareHands(dealer, [player]);

    expect(anc).toBe('> Player won');
    expect(player.status).toBe('won');
    expect(player.statusChanged).toBeTruthy();
    expect(player.handValue).toBe(21);
});

test('compareHands: Player wins via natural Blackjack', async () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Check if player wins via Natural Blackjack (Natural Blackjack is A + 10-Value card)
    player.hand = [{cardValue: 11, cardName: 'A♦'}, {cardValue: 10, cardName: 'J♠'}];
    player.handValue = 21;
    dealer.hand = [{cardValue: 8, cardName: '8♦'}, {cardValue: 10, cardName: 'J♠'}, {cardValue: 3, cardName: '3♠'}];
    dealer.handValue = 21; // Natural Blackjack takes precedence over a hand that is worth just 21

    let anc = await compareHands(dealer, [player]);

    expect(anc).toBe('> Player won, Blackjack!');
    expect(player.status).toBe('won');
    expect(player.statusChanged).toBeTruthy();
    expect(player.handValue).toBe(21);
});

test('compareHands: Player loses to Dealer', async () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Check if player has lost to dealer via lower handValue
    player.hand = [{cardValue: 7, cardName: '7♦'}, {cardValue: 10, cardName: 'J♠'}];
    player.handValue = 17;
    dealer.hand = [{cardValue: 10, cardName: '10♦'}, {cardValue: 9, cardName: '9♠'}];
    dealer.handValue = 19;

    let anc = await compareHands(dealer, [player]);

    expect(anc).toBe('> Player lost');
    expect(player.status).toBe('lost');
    expect(player.statusChanged).toBeTruthy();
    expect(player.handValue).toBeLessThan(dealer.handValue);
});

test('compareHands: Player wins when Dealer busts', async () => {

    const player = new Player('Player', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Check if player wins when Dealer busts
    player.hand = [{cardValue: 7, cardName: '7♦'}, {cardValue: 10, cardName: 'J♠'}];
    player.handValue = 17;
    dealer.hand = [{cardValue: 10, cardName: '10♦'}, {cardValue: 10, cardName: '10♠'}, {cardValue: 5, cardName: '5♠'}];
    dealer.handValue = 25;

    let anc = await compareHands(dealer, [player]);

    expect(anc).toBe('> Player won');
    expect(player.status).toBe('won');
    expect(player.statusChanged).toBeTruthy();
    expect(player.handValue).toBeLessThanOrEqual(21);
    expect(dealer.handValue).toBeGreaterThan(21);
});

test('compareHands: Multiple players are handled correctly', async () => {

    const playerOne = new Player('Player One', 0, 'active');
    const playerTwo = new Player('Player Two', 0, 'active');
    const playerThree = new Player('Player Three', 0, 'active');
    const dealer = new Dealer('Dealer', 0, 'active');

    // Check if multiple players are handled correctly
    playerOne.hand = [{cardValue: 5, cardName: '5♦'}, {cardValue: 10, cardName: 'J♠'}];
    playerOne.handValue = 15;
    playerTwo.hand = [{cardValue: 7, cardName: '7♦'}, {cardValue: 10, cardName: 'Q♠'}];
    playerTwo.handValue = 17;
    playerThree.hand = [{cardValue: 8, cardName: '8♦'}, {cardValue: 10, cardName: 'K♠'}];
    playerThree.handValue = 18;

    dealer.hand = [{cardValue: 10, cardName: '10♦'}, {cardValue: 7, cardName: '7♠'}];
    dealer.handValue = 17;
    
    const players = [playerOne, playerTwo, playerThree];
    let anc = await compareHands(dealer, players);

    expect(anc).toBe('> Player One lost\n> Player Two push\n> Player Three won'); // This is how the string appears in-syntax
    expect(players.every(plyr => plyr.statusChanged)).toBeTruthy(); // Check if all statuses have been changed

    expect(players[0].status).toBe('lost');
    expect(players[1].status).toBe('push');
    expect(players[2].status).toBe('won');
});