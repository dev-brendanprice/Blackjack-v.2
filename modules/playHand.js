import { askToPlayHand } from "./userInput.js";


// Logic for playing a hand
export async function playHand(player, houseDeck) {

    // Ask the player if they want to hit or stand
    let choice = await askToPlayHand(`\n${player.name}, Please enter your desired choice to play your hand: ("HIT" or "STAND")\n`);
    console.log(`${player.name} has chosen to ${choice}!`);

    // Return false if stand, else hit and return true
    if (choice === 'STAND') return false;
    if (choice === 'HIT') {
        let newCard = houseDeck.deal();
        player.hand.push(newCard);
        player.handValue += newCard.cardValue;
        return true;
    };
};