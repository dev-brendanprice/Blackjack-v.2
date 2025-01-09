import chalk from 'chalk';

// Card class, contains card suit, rank, card value, and card name
class Card {
    constructor(suit, rank, cardValue, cardName) {
        this.suit = suit;
        this.rank = rank;
        this.cardValue = cardValue;
        this.cardName = cardName;
    }
};

// Deck class which contains get/set and other functions
export default class Deck {
    constructor() {
        this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        this.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        this.suitAscii = ['♥', '♦', '♣', '♠'];
        this.cards = [];
    }

    // Creates 52 cards for a Deck, each have an assigned cardValue
    create() {
        let newCardsArray = [];

        // Loop over suits and ranks to get every card permutation
        for (const suit of this.suits) {
            for (const rank of this.ranks) {

                let cardValue = 10; // Default is 10 so King, Queen, and Jack automatically are assigned 10

                // Find corresponding card values
                const rankTypeCast = parseInt(rank); // (int) type cast, Rank is NOT King, Queen, Jack, or Ace, cardValue equal to rank
                if (!isNaN(rankTypeCast)) {
                    cardValue = rankTypeCast; // (int)
                }
                else if (rank === 'Ace') {
                    cardValue = 11; // Can be 1 or 11
                };

                // Format card name to use ASCII glyphs and shortened suit (King = K etc)
                let charOfRank = Array.from(rank)[0];
                const suitGlyph = this.suitAscii[this.suits.indexOf(suit)];
                let cardName;

                if (rank === '10') { // Avoid showing 1<suit>
                    charOfRank = '10';
                };

                // Check for specific suit text color
                if (suit === 'Hearts' || suit === 'Diamonds') { // Make text red
                    cardName = `${chalk.red(charOfRank)}${chalk.red(suitGlyph)}`;
                }
                else if (suit === 'Spades' || suit === 'Clubs') {  // Make text gray
                    cardName = `${chalk.gray(charOfRank)}${chalk.gray(suitGlyph)}`;
                };

                newCardsArray.push(new Card(suit, rank, cardValue, cardName)); // Push this *new* card to the array
            };
        };

        this.cards = newCardsArray;
    };

    // Shuffle the deck of cards using Fisher-Yates Shuffle (unbiased)
    shuffle() {
        let currentIndex = this.cards.length;
        while (currentIndex != 0) {

            // Get random index from 0-currentIndex and decrease currentIndex
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // Swap card at currentIndex for card at randomIndex
            [this.cards[currentIndex], this.cards[randomIndex]] = [
                this.cards[randomIndex], this.cards[currentIndex]
            ];
        };
    };

    // Deal a single Card, then remove it from Deck
    deal() {
        let topCard = this.cards.length - 1;
        let card = this.cards[topCard];
        this.cards.splice(topCard, 1); // Use splice to remove chosen card, and index, from Deck
        return card;
    };
};