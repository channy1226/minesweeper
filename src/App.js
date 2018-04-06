import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gridSize: 6,
      bombAmount: 5,
      gameOver: false,
      gameWon: false,
      timer: null,
      timerOn: false,
      counter: 0,
    };
    this.state.board = this.generate(this.state.gridSize, this.state.bombAmount);
    this.tick = this.tick.bind(this);
  }

  generate(gridSize, bombAmount) {
    let board = [];
    for (let x = 0; x < gridSize; x++) {
      board.push([]);
      for (let y = 0; y < gridSize; y++) {
        board[x][y] = {view: 0, revealed: false, flagged: false};
      }
    }

    if (bombAmount > gridSize * gridSize) {
      alert("You don't want that many bombs, do you?");
      return;
    }

    for (let i = 0; i < bombAmount; i++) {
      let x = Math.floor(Math.random() * gridSize);
      let y = Math.floor(Math.random() * gridSize);
      if (board[x][y].view !== '*') {
        board[x][y].view = '*';
      } else {
        i--;
      }
    }

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (board[x][y].view === '*') continue;

        for (let xd = -1; xd <= 1; xd++) {
          for (let yd = -1; yd <= 1; yd++) {
            if (xd === 0 && yd === 0) continue;
            if (x + xd < 0 || y + yd < 0 || x + xd >= gridSize || y + yd >= gridSize) continue;
            if (board[x + xd][y + yd].view === '*') board[x][y].view++;
          }
        }
      }
    }

    return board;
  }

  tick() {
    if (this.state.gameOver || this.state.gameWon) return;
    this.setState({
      counter: this.state.counter + 1
    });
  }

  handleClick(x, y, e) {
    if (this.state.gameOver || this.state.gameWon) return;
    let timer = setInterval(this.tick, 1000);
    this.setState({
      timerOn: true,
      timer
    })
    clearInterval(this.state.timer);

    if (e.type === 'contextmenu') { // right click
      e.preventDefault();
      if (this.state.board[x][y].revealed) return;
      this.state.board[x][y].flagged = !this.state.board[x][y].flagged;
      this.setState({
        board:this.state.board,
      });

      return;
    }

    let board = this.state.board;
    let gridSize = this.state.gridSize;

    this.state.board[x][y].flagged = false;
    this.state.board[x][y].revealed = true;
    if (this.state.board[x][y].view === '*') {
    this.setState({
      board:this.state.board,
      gameOver: true,
    })
      return;
    }


    if (board[x][y].view === 0) {
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          if (board[x][y].view === '*') continue;

          for (let xd = -1; xd <= 1; xd++) {
            for (let yd = -1; yd <= 1; yd++) {
              if (xd === 0 && yd === 0) continue;
              if (x + xd < 0 || y + yd < 0 || x + xd >= gridSize || y + yd >= gridSize) continue;
              if (board[x + xd][y + yd].view === 0) {
                board[x + xd][y + yd].revealed = true;
              }
            }
          }
        }
      }

      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          if (board[x][y].view === '*') continue;

          for (let xd = -1; xd <= 1; xd++) {
            for (let yd = -1; yd <= 1; yd++) {
              if (xd === 0 && yd === 0) continue;
              if (x + xd < 0 || y + yd < 0 || x + xd >= gridSize || y + yd >= gridSize) continue;
              if (board[x + xd][y + yd].view === 0) {
                board[x][y].revealed = true;
              }
            }
          }
        }
      }
    }

    let correctFlagged = 0;
    let correctRevealed = 0;
    let nonBomb = gridSize * gridSize - this.state.bombAmount;
    for (let x = 0; x < gridSize; x++) {
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

    this.setState({
      board:this.state.board
    })
  }

  handleGridChange(grid) {
    let gridSize = Math.min(Math.max(parseInt(grid.target.value) || 2, 2), 20);
    let bombAmount = Math.min(gridSize * gridSize, this.state.bombAmount);
    this.setState({board: this.generate(gridSize, bombAmount), gridSize: gridSize, bombAmount: bombAmount});
  }

  handleBombChange(bomb) {
    let bombs = Math.min(Math.max(parseInt(bomb.target.value) || 0, 0), this.state.gridSize * this.state.gridSize);
    this.setState({board: this.generate(this.state.gridSize, bombs), bombAmount: bombs});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Minesweeper! Right-click to flag a bomb. Good luck!</h1>
          <p>{this.state.timerOn?
            <div>Timer: {this.state.counter}</div> :
            <div> The timer will start when you make your first move </div>}</p>
          <p> Enter grid size (max 20):
          <input
            type="number"
            value={this.state.gridSize}
            onChange={this.handleGridChange.bind(this)}
          />
          </p>
          <p> Enter bomb amount:
          <input
            type="number"
            value={this.state.bombAmount}
            onChange={this.handleBombChange.bind(this)}
          />
          </p>
        </header>
        <div className="App-body">
        <p>
          {this.state.gameOver ? <h1>Game Over!</h1> : null}
          {this.state.gameWon ? <h1>You Won</h1> : null}
          {this.state.board.map((row, x) =>
            <div className="row">
                {row.map((item, y) => (
                  <span
                  onContextMenu={this.handleClick.bind(this, x, y)}
                  onClick={this.handleClick.bind(this, x, y)}
                  className = "item" >
                    {item.flagged ? '?' :
                    item.revealed ? item.view : ''
                  }
                </span>)
              )}
            </div>
          )}
        </p>
        </div>
      </div>
    );
  }
}

export default App;
