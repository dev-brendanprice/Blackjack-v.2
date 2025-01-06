import { clearConsole } from "./clearConsole.js";
import { promptUser } from "./userInput.js";

import fs from "fs";
import chalk from "chalk";
import terminalImage from "terminal-image";
import center_align from "center-align";
import { configureGame } from "../main.js";


// Print the image to the console whilst also creating a code-blocking function
function printImage(imagePath) {

    // Wrap fs.readFile and image buffer in a Promise to block tailing code
    return new Promise((resolve, reject) => {

        // Get image data from path
        fs.readFile(imagePath, async (err, data) => {
            if (err) reject(err);
        
            // Render image data in terminal
            const imageToPrint = await terminalImage.buffer(data, {width: 100, height: 27.55});
            resolve(imageToPrint);
        });
    });
};

// Function to introduce player to the game, this only runs once per script execution (using 'node .' at CLI)
export async function introduce() {

    clearConsole(); // Clear the console

    // Print/Render headmast stuff
    console.log(await printImage('./assets/headmast.png'));
    console.log(chalk.gray('Welcome to Blackjack! v1.0                                       Made by Brendan Price 02/01/2025'));

    // Print intro text from .txt file to console
    let introText = fs.readFileSync('./assets/introduction.txt', {encoding: 'utf-8'});
    console.log(chalk.blue(center_align(`\n${introText}`)));

    // Ask user to press enter to start the game
    await promptUser(chalk.red('\n\n\nPress ENTER to start the game..'))
    .then(() => configureGame());
};