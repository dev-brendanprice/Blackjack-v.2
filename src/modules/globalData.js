
// Globally mutable game data
export let gameData = {

    isDealerFacedownCardShowing: false, // Default

    // Setter method to allow global changes (can set both above variables)
    set({ isDealerFacedownCardShowing }) {

        // Check for either or variable being passed in parameter and set
        if (isDealerFacedownCardShowing !== undefined) this.isDealerFacedownCardShowing = isDealerFacedownCardShowing;
    }
};