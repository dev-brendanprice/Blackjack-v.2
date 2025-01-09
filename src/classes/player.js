
// Player class, contains player name, hand value, status (active, folded, etc), pos (turn order)
export default class Player {
    constructor(name, handValue, status) {
        this.name = name;
        this.handValue = handValue;
        this.status = status;
        this.isDealer = false; // Safe(er) way to check if player in iterative loop is dealer
        this.statusChanged = false; // Used to check if player status has been appended to player name
        this.statusAnnounced = false; // Used to check if player status has been announced in dialogue box
        this.hand = [];
    }

    // Returns the players' current hand + handValue
    getHand() {

        // Flatten hand which contains array of Card classes
        let handMap = this.hand.flatMap(item => { return item.cardName });

        handMap = handMap.join(', '); // Put spaces between items to prettify
        return handMap;
    };
};