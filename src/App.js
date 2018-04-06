import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      gridSize: 6,
      bombAmount: 5
    };
    this.state.board = this.generate(this.state.gridSize, this.state.bombAmount);
  }

  generate(gridSize, bombAmount) {
    let board = [];
    for (let x = 0; x < gridSize; x++) {
      board.push([]);
      for (let y = 0; y < gridSize; y++) {
        board[x][y] = {view: '+', revealed: false};
      }
    }

    if (bombAmount > gridSize * gridSize) {
      alert("You don't want that many bombs, do you?");
      return;
    }

    for (let i = 0; i < bombAmount; i++) {
      let x = Math.floor(Math.random() * gridSize);
      let y = Math.floor(Math.random() * gridSize);
      if (board[x][y].view != '*') {
        board[x][y].view = '*';
      } else {
        i--;
      }
    }

    return board;
  }

  handleClick(x, y) {
    this.state.board[x][y].revealed = true;
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
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.state.board.map((row, x) =>
            <div className="row">
                {row.map((item, y) => (<span onClick={this.handleClick.bind(this, x, y)} className = "item" >{item.revealed ? item.view : ''}</span>))}
            </div>)
          }
        </p>
        <p> Enter grid size (max 20)
        <input
          type="number"
          value={this.state.gridSize}
          onChange={this.handleGridChange.bind(this)}
        />
        </p>
        <p> Enter bomb amount
        <input
          type="number"
          value={this.state.bombAmount}
          onChange={this.handleBombChange.bind(this)}
        />
        </p>
      </div>
    );
  }
}

export default App;
