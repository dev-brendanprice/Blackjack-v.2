
// Check for active players, toggle boolean if there are active players
// This check can easily be accomplished with .some(), but I will use a different method here for showcase reasons
export async function checkForActive(players) {

    let activePlayerExists = false; // Default
    players.forEach((player) => {
        if (player.status === 'active') activePlayerExists = true; // Toggle boolean when active player is found
    });

    return activePlayerExists;
};

    // let activePlayerExists = players.some(player => player.status === 'active');