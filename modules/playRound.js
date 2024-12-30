import { configureGame, roundData } from '../main.js';
import { promptUser } from './userInput.js';
import { checkHands } from './checkHands.js';
import { clearConsole } from './clearConsole.js';
import { checkForActive } from './checkForActive.js';
import { renderTable } from './renderTable.js';

import chalk from 'chalk';


// Play a round of blackjack (recursively calls it self again based on user input)
export async function playRound(players, dealer, deck) {

    // Check for no players during round 0, e.g. the only player busts or wins - game ends
    // if (roundData.roundNumber === 0) {
    //     checkForActive(players);
    // };

    // Log round, game info
    clearConsole();
    console.log(chalk.bold.underline.gray(`\nRound ${roundData.roundNumber}\n`));

    // Increment the round counter
    roundData.set(roundData.roundNumber + 1); // Increase by 1

    // Validate all hands
    let endGameReason = await checkHands(players, dealer);

    // Render new table
    await renderTable(players, dealer, endGameReason);
    
    // Check if no active players, or game was concluded
    let activePlayersExist = await checkForActive(players); // Default return from this function is False
    if (!activePlayersExist) {

        // Ask user to start a new game
        return await promptUser(chalk.yellow(`${endGameReason}, Press ENTER to start a new game..`))
        .then(() => configureGame());
    };

    // Ask user to start next round
    return await promptUser(chalk.gray('\nPress enter to start next round'))
    .then(() => playRound(players, dealer, deck));
};