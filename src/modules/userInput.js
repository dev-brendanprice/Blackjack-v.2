import { configureGame } from '../main.js';
import { renderTable } from './renderTable.js';
import { clearConsole } from './clearConsole.js';

import readline from 'readline';
import chalk from 'chalk';


// Initialise readline interface
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// ask the player to HIT or STAND
export async function askToPlayHand(question) {

    // Run until player enters valid string
    while (true) {

        // Promise
        let answer = await new Promise((resolve) => {
            readlineInterface.question(chalk.green(question), (response) => resolve(response));
        });

        // Trim for whitespace and .toUpperCase()
        answer = answer.trim().toUpperCase();
        if ((answer === 'HIT' || answer === 'STAND') && answer) {
            return answer;
        };
        console.log(chalk.red('Please enter either "HIT" or "STAND", with no spaces: '));
    };
};

// Ask user a question and always receive valid response
export async function askQuestion(question) {

    // Wrap logic in while loop to avoid usage of recursion
    while (true) {

        // Use promise to await for response before executing next instruction
        let answer = await new Promise((resolve) => {
            readlineInterface.question(question, (response) => resolve(response))
        });

        // Trim whitespace from answer input
        answer = answer.trim();
        if (answer) {
            return answer;
        };
        console.log(chalk.red('Please enter something valid (no whitespace): '));
    };
};

// Ask user a question and always receive a valid number response
export async function askQuestionNumberInput(question) {

    // Again, avoid incursion inside while loop, wrap all logic in while
    while (true) {

        // Use promise to await for response before executing next instruction
        let answer = await new Promise((resolve) => {
            readlineInterface.question(question, (response) => resolve(response));
        });

        // Type cast input to integer in base 10, trim whitepsace from answer input
        answer = parseInt(answer.trim(), 10);
        if (!isNaN(answer) && answer >= 1) {
            return answer;
        };
        console.log(chalk.red('Please enter a number that is 1 or more, in its numerical form ("1" not "one", etc.): \n'));
    };
};

// Ask user to restart the game
export async function askToRestartGame(players, dealer, announcementString) {

    // Render the user data table before starting a new game
    clearConsole();
    await renderTable(players, dealer, announcementString);

    // Ask user to start a new game
    return await promptUser(chalk.yellow(`Press ENTER to start a new game..`))
    .then(async () => configureGame());
};

// Promise wrapper to prompt the user to do something (Hit Enter etc)
export function promptUser(message) {
    return new Promise((resolve) => {
        readlineInterface.question(message, () => {resolve()});
    });
};