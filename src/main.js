import { askQuestionNumberInput, promptUser } from './modules/userInput.js';
import { createPlayer, createDeck } from './modules/setup.js';
import { dealPairToAllPlayers } from './modules/dealCards.js';
import { clearConsole } from './modules/clearConsole.js';
import { renderTable } from './modules/renderTable.js';
import { playRound } from './modules/playRound.js';
import { introduce } from './modules/intro.js';
import { gameData } from './modules/globalData.js';
import Dealer from './classes/dealer.js';

import chalk from 'chalk';

// Declare default and fallback CLI chalk colors for compatibility
export const primaryText = chalk.supportsColor ? chalk.gray : chalk.white;
export const headerText = chalk.supportsColor ? chalk.bold.underline.gray : chalk.white;
export const noticeText = chalk.supportsColor ? chalk.italic.gray : chalk.white;
export const eventText = chalk.supportsColor ? chalk.green : chalk.white;
export const eventBgText = chalk.suportsColor ? chalk.bgGreen : chalk.white;
export const promptText = chalk.supportsColor ? chalk.yellow : chalk.white;
export const warnText = chalk.supportsColor ? chalk.red : chalk.white;

// Main entry point function
introduce();


// Initialize all game components (dealer, n players, deck of cards)
async function initGameComponents() {

    // Setup CLI console
    clearConsole();
    console.log(headerText('Game Setup\n'));

    gameData.isDealerFacedownCardShowing = false; // Initialize (reset) game data also

    const dealer = new Dealer('Dealer', 0, 'active');
    const deck = createDeck();
    const playerCount = await askQuestionNumberInput(promptText('How many people are playing the game?:\n'));
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
    console.log(noticeText('🛈 Note: These are the initial cards dealt to everyone before the first round\n'));
    await renderTable(players, dealer, ['> Players have been set\n> Initial cards have been dealt']); // Last parameter has to be Array

    // Finally, wait for user input to start game
    await promptUser(promptText('\nPress ENTER to start the game..'))
    .then(() => playRound(dealer, deck, players));
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