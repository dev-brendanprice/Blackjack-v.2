import { configureGame, eventText, headerText, promptText } from '../main.js';
import { promptUser } from './userInput.js';
import { checkHand } from './checkHands.js';
import { compareHands } from './compareHands.js';
import { clearConsole } from './clearConsole.js';
import { renderTable } from './renderTable.js';
import { playHand } from './playHand.js';
import { gameData } from './globalData.js';

import chalk from 'chalk';


// Play a round of blackjack (recursively calls it self again based on user input)
export async function playRound(players, dealer, houseDeck) {

    let announcement = '';

    // Check for active players
    let areActivePlayers = players.some(plyr => plyr.status === 'active');

    // Iterate over players and ask them to HIT or STAND
    for (let i=0; i < players.length && areActivePlayers; i++) {

        // Clear console and log round
        clearConsole();
        console.log(headerText('Player Table'));

        // Render table and get player from index
        let player = players[i];
        await renderTable(players, dealer, announcement);

        // Ask player to hit until they stand
        let hasChosenHit = true;
        while (hasChosenHit && player.status === 'active') {

            // Returns false when player stands
            hasChosenHit = await playHand(player, houseDeck);

            // Clear console and log round
            clearConsole();
            console.log(headerText('Player Table'));

            // Check player hand, re-render table
            await checkHand(player, dealer, players);
            await renderTable(players, dealer);
        };
    };

    
    // Check for no active players, play Dealer hand if True
    if (!areActivePlayers) {

        // Clear console, re-render table
        clearConsole();
        console.log(headerText('Player Table'));
        await renderTable(players, dealer, announcement);
        console.log(promptText('There are no active players, Skipping player turns..'));
    };
    console.log(eventText('-> Dealer revealing facedown card and playing hand'));
    
    // Wait for 3 seconds to reveal facedown card and play dealer's hand
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Toggle boolean to show dealer facedown card past this point
    gameData.set({ isDealerFacedownCardShowing: true });

    // Clear console, re-render table
    clearConsole();
    console.log(headerText('Player Table'));
    await renderTable(players, dealer);
    console.log(eventText('-> Dealer revealing facedown card and playing hand'));

    // Delay each iteration by 1 second, Play dealers hand until it's worth 17 or more (16 or less)
    while (dealer.handValue <= 16) {

        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds

        // Pull new card for Dealer
        let newCard = houseDeck.deal();
        dealer.hand.push(newCard);
        dealer.handValue += newCard.cardValue;

        // Clear console, Re-render table
        clearConsole();
        console.log(headerText('Player Table'))
        await renderTable(players, dealer);
        console.log(eventText('-> Dealer revealing facedown card and playing hand'));
    };

    // Compare players' hands against dealers' hand
    let announcements = await compareHands(dealer, players);

    // Clear console, Re-render table
    clearConsole();
    console.log(headerText('Player Table'))
    await renderTable(players, dealer, announcements);

    // If there are no active players
    let activePlayersExist = players.some(plyr => plyr.status === 'active');
    if (!activePlayersExist) {

        // Ask user to start a new game
        return await promptUser(chalk.yellow(`\nAll players have finished playing. Press ENTER to start a new game..`))
        .then(() => configureGame());
    };
};