import { askQuestion } from './userInput.js';
import { promptText } from '../main.js';
import Player from '../classes/player.js';
import Deck from '../classes/deck.js';


// Create new player via user input
export async function createPlayer(playerReference) {

    // Check if parameter is string (player name passed) or is Int (player counter passed)
    if (typeof playerReference === 'string') {
        return new Player(playerReference, 0, 'active');
    };

    let playerName = await askQuestion(promptText(`Player ${playerReference}, Please enter your player name: \n`));
    return new Player(playerName, 0, 'active');
};

// Create new deck and shuffle it, returns [Array]
export function createDeck() {

    let newDeck = new Deck();
    newDeck.create();
    newDeck.shuffle();
    return newDeck;
};