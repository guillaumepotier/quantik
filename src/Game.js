import React from 'react';

import Cell from './Cell';
import Piece from './Piece';

import Player from './Player';

import {
  hasWon,
  doMove,
  isPieceAllowed
} from './tools';

import {
  playv2
} from './ia'

import './Game.css';

const IA_DEPTH = 3;

export const getDefaultState = () => ({
  board: [
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false]
  ],
  players: [
    new Player('white'),
    new Player('black')
  ],
  turn: 0,
  choose: false,
  needRestart: false
});

class Game extends React.Component {
  constructor (args) {
    super(args);

    this.state = {
      ...getDefaultState(),
      withIA: true
    }
  }

  onCellClick (x, y) {
    if (this.state.board[x][y] || this.state.needRestart)
      return;

    this.setState({ choose: {x, y} });
  }

  onPieceClick (piece, i) {
    let { choose, turn, players, board } = this.state;
    const { x, y } = choose;
    let currentPlayer = players[turn%2];

    doMove(board, currentPlayer, piece, x, y);

    if (hasWon(board)) {
      alert(`Congrats player ${currentPlayer.color}!`);
      // this.setState(getDefaultState());
      this.setState({ needRestart: true, choose: false });
      return;
    }

    this.setState({
      board,
      turn: turn + 1,
      choose: false
    }, () => {
      if (this.state.withIA) {
        this.IAPlay();
      }
    });
  }

  IAPlay () {
    const start = new Date();
    const newState = playv2(this.state, IA_DEPTH);
    const end = new Date();

    console.log(`IA took ${end-start}ms to play`);

    this.setState({
      ...newState,
      turn: this.state.turn + 1
    }, () => {
      if (hasWon(this.state.board)) {
        alert(`Congrats IA!`);
        this.setState({ needRestart: true, choose: false });
      }
    });
  }

  renderGrid (board) {
    const cells = [];

    for (let i = 0; i <= 3; i++)
      for (let j = 0; j <= 3; j++)
        cells.push(<Cell key={`${i}:${j}`} x={i} y={j} board={board} onCellClick={() => this.onCellClick(i, j)} />)

    return cells;
  }

  render () {
    const { board, players, turn, choose } = this.state;
    const { x, y } = choose;
    const currentPlayer = players[turn%2];

    return (
      <div className="Game">

        <div className="Board">

        {this.renderGrid(board)}

        </div>

        <div className="Controls">
          Player vs. Player<input type="radio" name="player2" value="IA" checked={!this.state.withIA} onChange={() => this.setState({ withIA: false })} />
          Player vs. IA<input type="radio" name="player2" value="human" checked={this.state.withIA} onChange={() => this.setState({ withIA: true })} />
          {!this.state.needRestart &&
            <div>Player {currentPlayer.color} turn</div>
          }

          {this.state.needRestart &&
            <button onClick={() => {
              this.setState(getDefaultState());
            }}>New game!</button>
          }

          <div>--</div>

          <div className="Choice">
            {choose &&
              <div>
                <div>Choose</div>
                <div onClick={() => this.setState({ choose: false })}>X</div>
                <div>
                  {currentPlayer.pieces.map((piece, i) => {
                    if (!isPieceAllowed(board, x, y, piece, currentPlayer.color))
                      return false;
                    return <Piece key={i} color={currentPlayer.color} type={piece} allowed={true} onPieceClick={() => this.onPieceClick(piece, i) } />
                  })}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
