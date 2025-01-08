import { askQuestionNumberInput, promptUser } from './modules/userInput.js';
import { createPlayer, createDeck } from './modules/config.js';
import { dealCardsToAllPlayers } from './modules/dealCards.js';
import { clearConsole } from './modules/clearConsole.js';
import { renderTable } from './modules/renderTable.js';
import { playRound } from './modules/playRound.js';
import { introduce } from './modules/intro.js';
import Dealer from './classes/dealer.js';

import chalk from 'chalk';


// Globally mutable round data
export let roundData = {

    roundNumber: 0, // Zero-based, increments by 1 AFTER game setup
    isDealerFacedownCardShowing: false, // Default

    // Setter method to allow global changes (can set both above variables)
    set({ newRoundNumber, isDealerFacedownCardShowing }) {

        // Check for either or variable being passed in parameter and set
        if (newRoundNumber !== undefined) this.roundNumber = newRoundNumber;
        if (isDealerFacedownCardShowing !== undefined) this.isDealerFacedownCardShowing = isDealerFacedownCardShowing;
    }
};

introduce(); // (Main entry point) Calls configureGame() when finished


// Run the configuration for the game
export async function configureGame() {

    clearConsole(); // Remove all console content before starting game
    console.log(chalk.bold.underline.gray('Game Setup\n'));

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
    console.log(chalk.italic.gray('🛈 Note: These are the initial cards dealt to everyone before the first round\n'));
    await renderTable(players, dealer, ['> Players have been set\n> Initial cards have been dealt']); // Last parameter has to be Array

    // Finally, wait for user input to start game
    await promptUser(chalk.gray('\nPress ENTER to start the game..'))
    .then(() => playRound(players, dealer, deck));
};