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
            
            // Check for dealer
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
    
    let playersArray = [];

    for (let player of players) {

        // Check if player is dealer and only show when roundNumber === 0
        let handValue = player.handValue.toString();
        let rowData = stylePlayerData(player.name, player.getHand(), handValue, player.status, player.isDealer);;

        // Determine if player is dealer and apply text styling based on status & round zero
        if (player.isDealer && roundData.get() === 0) {
            handValue = player.getFacedownValue().toString();
            rowData = stylePlayerData(player.name, player.getHand(true), handValue, player.status, player.isDealer)
        };

        playersArray.push(rowData);
    };

    return playersArray;
};


// Render and configure the table for a [more] readable console output
export async function renderTable(players, dealer, dialogue = '') {

    return new Promise((resolve, reject) => {

        players.push(dealer); // Push dealer to players (removed at the end of this function)

        // Configure new table class
        let table = new Table({
            head: ['Name', 'Hand', 'Hand Value'],
            colWidths: [20, 15, 12]
        });

        // Get rows for player data
        let playerDataRows = mapPlayerData(players);

        // Check for parameter options
        if (dialogue) {

            // Push and configure table rows
            table.push(
                ...playerDataRows,
                [{colSpan: 3, content: chalk.cyan(`> ${dialogue}`)}]
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