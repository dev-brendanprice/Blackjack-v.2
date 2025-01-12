import { askQuestionNumberInput, promptUser } from './modules/userInput.js';
import { createPlayer, createDeck } from './modules/config.js';
import { dealPairToAllPlayers } from './modules/dealCards.js';
import { clearConsole } from './modules/clearConsole.js';
import { renderTable } from './modules/renderTable.js';
import { playRound } from './modules/playRound.js';
import { introduce } from './modules/intro.js';
import { gameData } from './modules/globalData.js';
import Dealer from './classes/dealer.js';

import chalk from 'chalk';

introduce(); // (Main entry point) Calls configureGame() when finished


// Initialize all game components ( dealer, n players, deck of cards )
async function initGameComponents() {

    // Setup CLI console
    clearConsole();
    console.log(chalk.bold.underline.gray('Game Setup\n'));

    gameData.isDealerFacedownCardShowing = false; // Initialize (reset) game data also

    const dealer = new Dealer('Dealer', 0, 'active');
    const deck = createDeck();
    const playerCount = await askQuestionNumberInput(chalk.black('How many people are playing the game?:\n'));
    const players = [];

    for (let i=0; i<playerCount; i++) { // Create n players, n is player input - playerCount
        const player = await createPlayer(i+1);
        players.push(player);
    };
    
    return { dealer, deck, players };
};

// Render new table and await user input to start game
async function startGame(dealer, deck, players) {

    // Print players' cards *before* validating scores/statuses
    clearConsole();
    console.log(chalk.italic.gray('🛈 Note: These are the initial cards dealt to everyone before the first round\n'));
    await renderTable(players, dealer, ['> Players have been set\n> Initial cards have been dealt']); // Last parameter has to be Array

    // Finally, wait for user input to start game
    await promptUser(chalk.gray('\nPress ENTER to start the game..'))
    .then(() => playRound(players, dealer, deck));
};

// Configures the main and global data
export async function configureGame() {

    // Create the dealer, house deck, and all players via player input
    const { dealer, deck, players } = await initGameComponents();

    // Deal cards to all players and the dealer
    dealPairToAllPlayers(dealer, deck, players);

    // Ask player(s) to start the game (renders new table)
    startGame(dealer, deck, players);
};