
// Dealer class, contains dealer name (optional), dealer hand, hand value, status (active, folded, etc)
export default class Dealer {
    constructor(name, handValue, status) {
        this.name = name;
        this.handValue = handValue;
        this.status = status;
        this.isDealer = true;
        this.statusChanged = false;
        this.hand = [];
    }

    // Exclusively return the second cards' handValue
    getFacedownValue() {
        return this.hand[1].cardValue;
    };

    // Returns the players' current hand + handValue
    getHand(isFacedownCardShowing) {

        // Flatten hand, check for active facedown rule
        const handMap = this.hand.flatMap(item => { return item.cardName });
        if (!isFacedownCardShowing) {
            handMap[0] = '**';
        };

        return handMap.join(', '); // Prettify with commas
    };
};