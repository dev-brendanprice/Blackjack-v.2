import chalk from 'chalk';

const faceCards = ['Jack', 'Queen', 'King', 'Ace'];

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

    // Create a deck of 52 cards
    create() {

        // Create all 52 cards
        for (const suit of this.suits) {
            for (const rank of this.ranks) {

                let cardName;
                let cardValue = 10; // default, unless card is not face-card

                // If card is not face-card
                if (!faceCards.includes(rank)) {
                    cardValue = parseInt(rank);
                }
                else if (rank === 'Ace') {
                    cardValue = 11;
                };

                // Get suit glyph and first character from card rank
                const suitGlyph = this.suitAscii[this.suits.indexOf(suit)];
                let firstCharacterFromCardRank = Array.from(rank)[0];

                // avoid a 10-value card from showing as '1'
                if (rank === '10') firstCharacterFromCardRank = '10';

                // Get card name and apply text coloring
                if (suit === 'Hearts' || suit === 'Diamonds') {
                    cardName = chalk.red(`${firstCharacterFromCardRank}${suitGlyph}`);
                }
                else { // suit is not hearts or diamonds
                    cardName = chalk.gray(`${firstCharacterFromCardRank}${suitGlyph}`);
                };

                // Push card to Deck
                this.cards.push(new Card(suit, rank, cardValue, cardName));
            };
        };
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

    // Deal the top card, then remove it
    deal() {

        const topCard = this.cards.length - 1;
        const card = this.cards[topCard];
        this.cards.splice(topCard, 1); // Use splice to remove chosen card, and index, from Deck
        return card;
    };
};