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

const IA_DEPTH_HARD = 5;
const IA_DEPTH_MEDIUM = 3;
const IA_DEPTH_EASY = 2;

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
  iaComputing: false,
  needRestart: false
});

class Game extends React.Component {
  constructor (args) {
    super(args);

    this.state = {
      ...getDefaultState(),
      withIA: true,
      iaLevel: IA_DEPTH_MEDIUM
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
        this.setState({ iaComputing: true });
        setTimeout(() => this.IAPlay(), 300);
      }
    });
  }

  IAPlay () {
    const start = new Date();
    const newState = playv2(this.state, this.state.iaLevel);
    const end = new Date();

    console.log(`IA took ${end-start}ms to play`);

    this.setState({
      ...newState,
      turn: this.state.turn + 1,
      iaComputing: false
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
          <div className="HumanOrIa">
            Player vs. Player<input type="radio" name="player2" value="IA" checked={!this.state.withIA} onChange={() => this.setState({ withIA: false })} />
            Player vs. IA<input type="radio" name="player2" value="human" checked={this.state.withIA} onChange={() => this.setState({ withIA: true })} />
          </div>
          {this.state.withIA &&
            <div className="IALevel">
              <label htmlFor="ia_level">IA Difficulty</label>
              <select id="ia_level" name="ia_level" value={this.state.iaLevel} onChange={event => this.setState({ iaLevel: parseInt(event.target.value, 10) }) }>
                <option value={IA_DEPTH_EASY}>Easy</option>
                <option value={IA_DEPTH_MEDIUM}>Medium</option>
                <option value={IA_DEPTH_HARD}>Hard</option>
              </select>
            </div>
          }

          {!this.state.needRestart &&
            <div>Player {currentPlayer.color} turn</div>
          }

          {this.state.needRestart &&
            <button onClick={() => {
              this.setState(getDefaultState());
            }}>New game!</button>
          }

          <div>--</div>

          {this.state.iaComputing &&
            <div>IA is computing..</div>
          }

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
