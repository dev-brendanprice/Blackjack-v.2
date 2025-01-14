import { clearConsole } from "./clearConsole.js";
import { promptUser } from "./userInput.js";
import { configureGame, primaryText, promptText } from "../main.js";

import fs from "fs";
import path from "path";
import center_align from "center-align"; // Used to center-align text in console
import terminalImage from "terminal-image";

// Get __dirname to use with path.join to retain relative file paths
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Function to introduce player to the game, this only runs once per script execution (using 'node .' at CLI)
export async function introduce() {

    clearConsole();

    // Render headmast PNG to console
    console.log(await printImage(path.join(__dirname, '../assets/headmast.png')));

    // Print intro text from .txt file to console
    const headerText = fs.readFileSync(path.join(__dirname, '../assets/headerText.txt'), {encoding: 'utf-8'});
    const introText = fs.readFileSync(path.join(__dirname, '../assets/introduction.txt'), {encoding: 'utf-8'});
    console.log(primaryText(headerText));
    console.log(primaryText(center_align(`\n${introText}`)));

    // Ask user to press enter to start the game
    await promptUser(promptText('\n\n\nPress ENTER to start the game..'))
    .then(() => configureGame());
};

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