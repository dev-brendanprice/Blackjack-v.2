
// Check for active players, toggle boolean if there are active players
export async function checkForActive(players) {

    let activePlayerExists = false; // Default
    players.forEach((player) => {
        if (player.status === 'active') activePlayerExists = true; // Toggle boolean when active player is found
    });

    return activePlayerExists;
};