import Deck from './classes/deck.js';
import Player from './classes/player.js';
import Dealer from './classes/dealer.js';
import {askQuestion, askQuestionNumberInput, promptUser} from './modules/input.js';
import chalk from 'chalk';
import asciiTextGenerator from 'ascii-text-generator';

let roundCounter = 1;

// Wrapper to create new deck, and shuffle it
function createNewDeck() {
    let newDeck = new Deck();
    newDeck.create();
    newDeck.shuffle();
    return newDeck; // (array)
};

// Ease-use function to clear console and re-configure header
function clearConsole() {
    console.clear();
    const blackjack = asciiTextGenerator('BLACKJACK', '2');
    console.log(chalk.cyan(blackjack));
    console.log(chalk.magenta('Welcome to BlackJack! v1.0                   Made by Brendan Price 24/12/2024 \n\n'));
};

// Ease-use function to check status of player
async function checkPlayerStatus(player, playersArray) {

    if (player.status === 'bust') {

        // Remove player from array when they bust
        let playerIndex = playersArray.indexOf(player);
        playersArray.splice(playerIndex, 1);
    }
    else if (player.status === 'won') {

        // Ask player to start a new game
        return await promptUser(chalk.yellow('\nPress enter to start a NEW game!'))
        .then(() => {
            gameSetup();
        });
    };
};

// Deal cards to all players, before the first round (during game setup)
function dealCardsToAllPlayers(dealer, players, houseDeck) {

    // Add the dealer to index 0 in players array
    players.unshift(dealer);

    const cardsPerPlayer = 2; // This number can be changed to whatever the user wants
    const playerCount = players.length;

    // Deal the cards one at a time, evenly distributed
    for (let i=0; i < playerCount * cardsPerPlayer; i++) {

        let index = i % players.length;
        let dealtCard = houseDeck.deal();
        players[index].hand.push(dealtCard);
        players[index].handValue += dealtCard.cardValue;
    };
};

// Main entry point
async function gameSetup() {

    roundCounter = 0;

    clearConsole();
    console.log(chalk.bold(chalk.underline(chalk.gray('Game Setup'))));

    // Make players array, get player count, make house deck, create dealer
    const dealer = new Dealer('Dealer', 0, 'active');
    const houseDeck = createNewDeck();
    const playerCount = await askQuestionNumberInput(chalk.blue('Please enter how many players there are: \n'));
    let players = [];

    // Loop over n playerCount, get player name and positions
    for (let i=0; i < playerCount; i++) {

        // Ask for player name, save player, send stdout
        let playerName = await askQuestion(chalk.blue(`Player ${i+1}, please enter your name: \n`));
        players.push(new Player(playerName, 0, 'active', i));
        clearConsole();
    };

    console.log(chalk.bold(chalk.underline(chalk.gray('Game Setup'))));
    
    // Deal cards between all the players, for an even and fair distribution
    dealCardsToAllPlayers(dealer, players, houseDeck);

    console.log(chalk.cyan('> Dealer has been created'));
    console.log(chalk.cyan('> Player(s) have been set'));
    console.log(chalk.cyan('> Cards have been dealt \n'));

    // Face-down card is the second card
    dealer.displayFacedownCard();

    // Check validity of all players hand
    for (let player of players) {

        // Evaluate the current players' score (+ Log hand)
        let dealerbust = player.evaluateScore();

        // Check if dealer is bust
        if (dealerbust === 'dealerbust') {
            console.log('Dealer bust, all remaining players win');

            // Ask player to start a new game
            return await promptUser(chalk.yellow('\nPress enter to start a NEW game!'))
            .then(() => {
                gameSetup();
            });
        };

        // Check if player is bust
        await checkPlayerStatus(player, players); // Contains an await instruction inside
    };

    // Ask player to start game
    await promptUser(chalk.gray('\nPress enter to start the game..'))
    .then(() => {
        playRound(dealer, [players[1]], houseDeck);
    });
};

// Logic of the game *after* cards have been drawn for the first time
async function playRound(dealer, players, houseDeck) {


    console.log(players);


    // Get player choices
    for (let player of players) {

        clearConsole();
        console.log(chalk.bold(chalk.underline(chalk.gray(`Game is in progress: Round ${roundCounter}\n`))));
        console.log(dealer.getHand());

        // Log the players' current hand
        console.log(`${player.name}'s hand: ${player.getHand()}`);

        let playerChoice = await askQuestion(chalk.blue(`${player.name}, do you want to HIT or STAND: (Type "HIT" or "STAND") \n`));
        playerChoice = playerChoice.toUpperCase(); // Soft input validation
        
        // Check player choice
        if (playerChoice === 'HIT') { // Hit, Deal card

            let dealtCard = houseDeck.deal();
            player.hand.push(dealtCard);
            player.handValue += dealtCard.cardValue;

            // Check status of player, update status, else Log current hand
            player.evaluateScore();
        };
        // Else, STAND (go next round)
        
        // Check if player is bust
        await checkPlayerStatus(player, players); // Contains an await instruction inside
    };

    // Do dealer stuff
    let dealtCard = houseDeck.deal();
    dealer.hand.push(dealtCard);
    dealer.handValue += dealtCard.cardValue;


    // Check if there are players left in the game, else start next round
    if (players.length !== 0) { // Not zero

        // Ask player to go to next turn
        await promptUser(chalk.gray('\nPress enter to start next turn..'))
        .then(() => {
            playRound(dealer, players, houseDeck);
        });
    }
    else {

        // Ask player to start a new game
        return await promptUser(chalk.yellow('\nPress enter to start a NEW game!'))
        .then(() => {
            gameSetup();
        });
    };

    roundCounter++; // Count the rounds
};


gameSetup(); // Main entry point