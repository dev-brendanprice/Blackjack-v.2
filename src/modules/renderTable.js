import { gameData } from './globalData.js';

import Table from 'cli-table3';
import chalk from 'chalk';


// Style String properties based on entity status
function stylePlayerData(status, name, hand, handValue) {

    let row = [status, name, hand, handValue];
    if (status === 'won') {
        return row.map(v => `${chalk.bgYellow(v)}`);
    }
    else if (status === 'lost') {
        return row.map(v => `${chalk.gray(v)}`);
    }
    else if (status === 'bust') {
        return row.map(v => `${chalk.strikethrough.gray(v)}`);
    };

    return row;
};


// Mutate and return players to only contain what is required in the table
function mapPlayerData(entities) {

    return entities.map(entity => {

        // Don't reveal total handValue if entity is Dealer (facedown rule)
        let handValue = entity.handValue.toString();
        if (entity.isDealer && !gameData.isDealerFacedownCardShowing) {
            handValue = entity.getFacedownValue().toString();
        };

        // Format rows and push to return Array
        return stylePlayerData(
            entity.status,
            entity.name,
            entity.getHand(gameData.isDealerFacedownCardShowing),
            handValue
        );
    });
};


// Configure and Render a CLI table that contains player data
export async function renderTable(players, dealer, dialogue = '') {

    // Wrap in a Promise to ensure the table is always rendered when called
    return new Promise(resolve => {

        let entities = [...players, dealer];
        let lengthOfLongestPlayerName = entities.sort((a,b) => { return b.length - a.length })[0]; // Make name column length responsive to player names

        // Configure table and row data
        let rowData = mapPlayerData(entities);
        let table = new Table({
            head: ['Status', 'Name', 'Hand', 'Hand Value'],
            colWidths: [12, lengthOfLongestPlayerName.length, 20, 12]
        });

        // Push and configure table rows, (All properties are String)
        if (dialogue) {
            table.push(...rowData, [{colSpan: 4, content: chalk.green(dialogue)}])
        } else {
            table.push(...rowData);
        };

        console.log(table.toString()); // Wildcard type-cast to String
        resolve();
    });
};