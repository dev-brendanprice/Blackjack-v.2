import { configureGame, roundData } from '../main.js';
import { promptUser } from './userInput.js';
import { checkHand } from './checkHands.js';
import { clearConsole } from './clearConsole.js';
import { checkForActive } from './checkForActive.js';
import { renderTable } from './renderTable.js';
import { playHand } from './playHand.js';

import chalk from 'chalk';


// Play a round of blackjack (recursively calls it self again based on user input)
export async function playRound(players, dealer, houseDeck) {

    // Increment round counter
    roundData.set({ newRoundNumber: roundData.roundNumber + 1 });

    // Iterate over players and ask them to HIT or STAND
    let announcement;
    for (let i=0; i < players.length; i++) {

        // Clear console and log round
        clearConsole();
        console.log(chalk.bold.underline.gray(`\nRound ${roundData.roundNumber}\n`));

        // Render table and get player from index
        let player = players[i];
        await renderTable(players, dealer, announcement);

        // Ask player to hit until they stand
        let isPlaying = true;
        while (isPlaying && player.status === 'active') {

            // Returns true when player stands
            isPlaying = await playHand(player, houseDeck);

            // Clear console and log round
            clearConsole();
            console.log(chalk.bold.underline.gray(`\nRound ${roundData.roundNumber}\n`));

            // Check player hand, re-render table
            announcement = await checkHand(player, dealer, players);
            await renderTable(players, dealer, announcement);
        };
    };
    
    // Check for no active players
    let activePlayersExist = await checkForActive(players); // Default return from this function is False
    if (!activePlayersExist) {

        // Ask user to start a new game
        return await promptUser(chalk.yellow(`\nAll players have finished their hands. Press ENTER to start a new game..`))
        .then(() => configureGame());
    };


    // Dealer mechanics past this point
    // Toggle boolean to show dealer facedown card past this point
    roundData.set({ isDealerFacedownCardShowing: true });
    console.log(roundData.isDealerFacedownCardShowing);

    // Clear console, re-render table
    clearConsole();
    console.log(chalk.bold.underline.gray(`\nRound ${roundData.roundNumber}\n`));
    await renderTable(players, dealer, announcement);

    console.log(chalk.bgGreen('-> Dealer is playing their hand..'));
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before playing dealer hand

    // Delay each iteration by 1 second, Play dealers hand until it's worth 17 or more (16 or less)
    while (dealer.handValue <= 16) {

        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay by 1 second

        // Pull new card for Dealer
        let newCard = houseDeck.deal();
        dealer.hand.push(newCard);
        dealer.handValue += newCard.cardValue;

        // Clear console, Re-render table
        clearConsole();
        console.log(chalk.bold.underline.gray(`\nRound ${roundData.roundNumber}\n`));
        await renderTable(players, dealer);
    };

    // Check dealers' hand
    let dealerAnnouncement = await checkHand(dealer, dealer, players);
    console.log(dealer.getHand());
    console.log(dealerAnnouncement);

    // Clear console, Re-render table
    clearConsole();
    console.log(chalk.bold.underline.gray(`\nRound ${roundData.roundNumber}\n`));
    await renderTable(players, dealer, dealerAnnouncement);
};