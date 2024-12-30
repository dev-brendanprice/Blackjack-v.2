import { askQuestionNumberInput, promptUser } from './modules/userInput.js';
import { createPlayer, createDeck } from './modules/config.js';
import { dealCardsToAllPlayers } from './modules/dealCards.js';
import { clearConsole } from './modules/clearConsole.js';
import { renderTable } from './modules/renderTable.js';
import { playRound } from './modules/playRound.js';
import Dealer from './classes/dealer.js';

import chalk from 'chalk';

// Globally mutable
export let roundData = {

    roundNumber: 0, // Zero-based, increments by 1 AFTER game setup

    // Get and Set methods
    get() { return this.roundNumber; }, // get() is redundant but is here for practicality
    set(newRoundNumber) { this.roundNumber = newRoundNumber; }
};

configureGame(); // (Entry point) Hoisted function can execute [here] at top-level


// Run the configuration for the game
export async function configureGame() {

    clearConsole(); // Remove all console content before starting game

    // Create dealer, deck and players array
    let dealer = new Dealer('Dealer', 0, 'active');
    let deck = createDeck();
    let players = [];

    // Ask user how many people are playing
    let playerCount = await askQuestionNumberInput(chalk.blue('How many people are playing?: \n'));

    // Create n (playerCount) players
    for (let i=0; i<playerCount; i++) {
        players.push(await createPlayer(i+1));
    };

    // Deal cards to all players and the dealer
    dealCardsToAllPlayers(players, dealer, deck);

    // Print players' cards *before* validating scores/statuses
    clearConsole();
    renderTable(players, dealer, 'Players have been set, Cards have been dealt');

    // Finally, wait for user input to start game
    await promptUser(chalk.gray('\nPress enter to start the game..'))
    .then(() => { playRound(players, dealer, deck); });
};