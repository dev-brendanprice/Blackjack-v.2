
// Dealer class, contains dealer name (optional), dealer hand, hand value, status (active, folded, etc)
export default class Dealer {
    constructor(name, handValue, status) {
        this.name = name;
        this.handValue = handValue;
        this.status = status;
        this.isDealer = true;
        this.statusVisible = false;
        this.hand = [];
    }

    // Exclusively return the second cards' handValue
    getFacedownValue() {
        return this.hand[1].cardValue;
    };

    // Returns the players' current hand + handValue
    getHand(facedownRule = false) { // Default to false

        // Convert player hand into a flat array of strings
        let handMap = this.hand.flatMap(item => { return item.cardName });

        // Check if we are returning hand with facedown rule
        if (facedownRule) {
            handMap[0] = '**';
        };

        return handMap.join(', '); // Put spaces between items to prettify
    };
};