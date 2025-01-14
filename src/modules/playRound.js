import { configureGame, eventText, headerText, promptText } from '../main.js';
import { promptUser } from './userInput.js';
import { compareHands } from './compareHands.js';
import { clearConsole } from './clearConsole.js';
import { renderTable } from './renderTable.js';
import { playHand } from './playHand.js';
import { gameData } from './globalData.js';


// Clear the console, re-render table
async function refreshConsole(players, dealer, header, roundSummary) {

    clearConsole();
    console.log(headerText(`${header}`));
    await renderTable(players, dealer, roundSummary);
};


// Play each player hand, play dealer hand, end round
export async function playRound(dealer, deck, players) {

    // Check for active players
    let areActivePlayers = players.some(player => player.status === 'active');
    let roundSummary = '';

    // Iterate over each player, ask to hit or stand
    for (const player of players) {

        // Prepare console for current hand
        let hasChosenHit = true;
        refreshConsole(players, dealer, 'Player Table', roundSummary);

        // Deal card to play until they stand
        while (hasChosenHit && player.status === 'active') {

            hasChosenHit = await playHand(player, deck); // playHand() returns false if stand is chosen
            await compareHands(dealer, [player], true); // Evaluate hand to apply text coloring
            refreshConsole(players, dealer, 'Player Table');
        };
    };

    // 3 second pause, play dealer hand
    console.log(eventText('-> Dealer revealing facedown card and playing hand'));
    await new Promise((resolve) => {setTimeout(resolve, 3000)});
    gameData.set({ isDealerFacedownCardShowing: true });

    // Prepare console for dealer hand
    refreshConsole(players, dealer, 'Player Table');
    console.log(eventText('-> Dealer revealing facedown card and playing hand'));

    // Play dealers' hand
    while (dealer.handValue <= 16) {

        await new Promise((resolve) => {setTimeout(resolve, 1000)});

        // Deal card and update handValue
        let card = deck.deal();
        dealer.hand.push(card);
        dealer.handValue += card.cardValue;

        refreshConsole(players, dealer, 'Player Table');
        console.log(eventText('-> Dealer revealing facedown card and playing hand'));
    };

    // Compare player hands with the dealer
    roundSummary = await compareHands(dealer, players);
    areActivePlayers = players.some(player => player.status === 'active');
    refreshConsole(players, dealer, 'Player Table', roundSummary); // Prepare console for end of round

    // No active players, ask to start new game
    if (!areActivePlayers) {
        await promptUser(promptText(`\nAll players have finished playing. Press ENTER to start a new game..`))
        .then(() => configureGame());
    };
};