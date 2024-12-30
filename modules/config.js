import { askQuestion } from './userInput.js';
import Player from '../classes/player.js';
import Deck from '../classes/deck.js';

import chalk from 'chalk';


// Create new player via user input
export async function createPlayer(counter) {

    let userResponse = await askQuestion(chalk.blue(`Player ${counter}, Please enter your player name: \n`));
    return new Player(userResponse, 0, 'active');
};

// Create new deck and shuffle it, returns [Array]
export function createDeck() {

    let newDeck = new Deck();
    newDeck.create();
    newDeck.shuffle();
    return newDeck;
};