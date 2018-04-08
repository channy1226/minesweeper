<h1> Dynamic Minesweeper Game </h1>

At the start of the game, we ask the user for the amount of bomb and the grid size of the game (default being 5 bombs and a 6 x 6 grid)

Thus, the initial state is: 

    this.state = {
      gridSize: 6,
      bombAmount: 5,
      gameOver: false,
      gameWon: false,
      timer: null,
      timerOn: false,
      counter: 0,
    };
    
We then set the state to the user's imput via handleGridChange and handleBombChange with <input>.
We use the generate(gridSize, BombAmount) function to regenerate a new grid with appropriate amount of bombs. 

The board is an array of hashmap containing view (the display - 0 for no bomb nearby and 1 for 1 bomb nearby, etc.), revealed(did the user reveal this particular tile), flagged(a boolean indicating if the user has flagged the tile as a potential bomb tile).

The handleClick(x, y, e) function starts the timer once the user make his first move as well as regenerate the state using the generate function each time the user reveals a tile.

The adjacent tiles next to a 0 will keep revealing themselves, so board[x][y].revealed will be set to true for those tiles.

The game is won when the user has flagged the correct amount of bomb or reveal all the non-bomb tiles:

    let nonBomb = gridSize * gridSize - this.state.bombAmount;
    let correctFlagged = 0;
    let correctRevealed = 0;
    
      for (let y = 0; y < gridSize; y++) {
        if (this.state.board[x][y].view === '*' && this.state.board[x][y].flagged) correctFlagged++;
        if (this.state.board[x][y].view !== '*' && this.state.board[x][y].flagged) correctFlagged--;
        if (this.state.board[x][y].view !== '*' && this.state.board[x][y].revealed) correctRevealed++;
      }
    }

    if (correctFlagged === this.state.bombAmount || correctRevealed === nonBomb) {
      this.setState({
        gameWon: true
      })
    }
    
The game is lost when the user reveal a tile board[x][y].view === '*', and the timer stops.
