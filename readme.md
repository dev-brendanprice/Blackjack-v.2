![Readme.md Blackjack Header Image](/src/assets/github_headmast.png)

This project is a Node.js-based implementation of the classic card game Blackjack.  This project provides a way to play Blackjack at CLI which offers a simple yet interactive experience.

![Showcase of Gameplay](/src/assets/github_showcase.png)

## Installation
Ensure you have the latest version of [git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/en/download) installed.

1. **Clone the respository:**
    ```shell
    git clone https://github.com/dev-brendanprice/Blackjack-v.2.git
    ```

2. **Navigate into the project directory:**
    ```shell
    cd Blackjack-v.2
    ```

3. **Install project dependencies:**
    ```shell
    npm install
    ```


## Usage
Because this is a CLI based game, it is recommended that you use specific CLI clients. Other CLI clients, like Git Bash, may cause incorrect coloring, and lack of text formatting.
- Windows: CMD (best) or Powershell
- MacOS: zsh
- Linux: Default terminal app *should* be fine, but hasn't been tested

Finally, you can start the game using this command:

```shell
npm run start
```
> **Note:** It is also strongly recommended that you play on the largest possible CLI window size for best clarity

## Project Structure
```
Blackjack-v.2/
├── src /                 # Main source directory
    ├── assets/               # Images and text files
    ├── classes/              # Classes for game and entity data
    ├── modules/              # Modular functions and modules
    ├── specs/                # Unit tests for game logic and capabilities
    ├── main.js               # Main entry point file
├── esling.config.js      # Config for ESlint to maintain better code
├── readme.md             # This file
├── package.json          # Project metadata and dependencies
└── .gitignore            # Used to ignore files and directories

+   node_modules/         # Contains dependencies, will appear via `npm install`
```


## Known Issues (That won't be fixed)
These are issues that are known, but wont be fixed, as the time it would take to fix any of these issues will vastly outweigh the advantages of fixing them.  These issues also do not affect the gameplay in any capacity and are mostly just visual errors that can easily be ignored.

1. Upon initially starting the game, when the blackjack image headmast is visible, resizing the CLI window will cause the CLI-image dependancy to create massive visual artifacting. This only happens with the headmast image and is just a visual error which poses no impairment to the functionality or performance of the game.  It is advised that you stick to the same CLI window size after you start the game with `npm run start`.


## License
Published under MIT license.
