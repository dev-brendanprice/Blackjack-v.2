import { roundData } from '../main.js';

import Table from 'cli-table3';
import chalk from 'chalk';


// Style the player data according to the players/dealers' status
function stylePlayerData(name, hand, handValue, status, isDealer) {

    // Check each scenario
    switch (status) {

        case 'won':
            return [chalk.bgYellow(name), chalk.bgYellow(hand), chalk.bgYellow(handValue)];

        case 'bust':
        case 'push':
            return [chalk.strikethrough.gray(name), chalk.strikethrough.gray(hand), chalk.strikethrough.gray(handValue)];

        case 'lost':
            
            // Dealer has different text style if they lose
            if (isDealer) {
                return [chalk.bgRed(name), chalk.bgRed(hand), chalk.bgRed(handValue)];
            };

            return [chalk.gray(name), chalk.gray(hand), chalk.gray(handValue)];

        default:
            return [name, hand, handValue];
    };
};


// Mutate and return players to only contain what is required in the table
function mapPlayerData(players) {
    
    let playerRows = [];
    for (let player of players) {

        // Check if player is dealer and only show facedown after first round
        let handValue = player.handValue.toString();

        // Determine if player is dealer and apply text styling based on status & if isDealerFacedownCardShowing is set to True
        if (player.isDealer && roundData.isDealerFacedownCardShowing === false) {
            handValue = player.getFacedownValue().toString();
        };

        // Declare new Array to return
        let rowData = stylePlayerData(
            player.name,
            player.getHand(roundData.isDealerFacedownCardShowing),
            handValue,
            player.status,
            player.isDealer
        );

        playerRows.push(rowData);
    };

    return playerRows;
};


// Render and configure the table for a [more] readable console output
export async function renderTable(players, dealer, dialogue = '') {

    // Wrap in a Promise to ensure the table is always rendered when called
    return new Promise((resolve, reject) => {

        players.push(dealer); // Push dealer to players (removed at the end of this function)

        // Configure new table class
        let table = new Table({
            head: ['Name', 'Hand', 'Hand Value'],
            colWidths: [20, 20, 12]
        });

        // Get rows for player data
        let playerDataRows = mapPlayerData(players);

        // Check for parameter options
        if (dialogue) {

            // Push and configure table rows
            table.push(
                ...playerDataRows,
                [{colSpan: 3, content: chalk.cyan(dialogue)}] // dialogue is always type-casted to String
            );
        }
        else {

            // Push and configure table rows without dialogue row
            table.push(...playerDataRows);
        };

        console.log(table.toString()); // Printing table only works in string format
        players.pop(); // Remove dealer from players array

        resolve() // Fulfill Promise
    });
};