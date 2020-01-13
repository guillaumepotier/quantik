import React from 'react';

import uniq from 'lodash/uniq'

import Cell from './Cell';
import Piece from './Piece';

import Player from './Player';

import {
  hasWon,
  doMove,
  undoMove,
  isPieceAllowed,
  humanizeInt,
  humanizeMs,
  logGameResult
} from './tools';

import {
  playv2
} from './ia'

import './Game.css';

const IA_DEPTH_HARD = 6;
const IA_DEPTH_MEDIUM = 5;
const IA_DEPTH_EASY = 3;

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
  chosen: false,
  iaComputing: false,
  iaLog: false,
  needRestart: false,
  won: false
});

class Game extends React.Component {
  constructor (args) {
    super(args);

    this.state = {
      ...getDefaultState(),
      withIA: true,
      iaFirst: false,
      iaLevel: IA_DEPTH_MEDIUM
    }
  }

  onCellClick (x, y) {
    if (this.state.board[x][y] || this.state.needRestart)
      return;

    this.setState({ chosen: {x, y} });
  }

  onPieceClick (piece, i) {
    let { chosen, turn, players, board, withIA, iaLevel } = this.state;
    const { x, y } = chosen;
    let currentPlayer = players[turn%2];

    doMove(board, currentPlayer, piece, x, y);
    const won = hasWon(board, true);

    if (false !== won) {
      alert(`Congrats player ${currentPlayer.color}!`);
      this.setState({ needRestart: true, chosen: false, won });

      if (withIA)
        logGameResult(currentPlayer.color === 'white', iaLevel);

      return;
    }

    this.setState({
      board,
      players,
      turn: turn + 1,
      chosen: false
    }, () => {
      if (withIA) {
        this.setState({ iaComputing: true });
        setTimeout(() => this.IAPlay(), 300);
      }
    });
  }

  onIAFirstChange () {
    const iaFirst = !this.state.iaFirst;
    this.setState({ iaFirst });

    if (iaFirst && this.state.turn === 0) {
      this.iaFirst();
    }
  }

  iaFirst () {
    this.IAPlay();
    this.setState({ turn: 0 });
  }

  IAPlay () {
    // todo: make a IA class with this private var
    window.evaluatedMoves = 0;
    const { iaLevel } = this.state;

    const start = new Date();
    const newState = playv2(this.state, this.state.iaLevel);
    const end = new Date();

    console.log(`IA took ${end-start}ms to play`);

    if (false === newState) {
      alert(`Congrats white! IA has no move left to play, you won!`);
      this.setState({ needRestart: true, chosen: false });
      logGameResult(true, iaLevel);
      return;
    }

    this.setState({
      ...newState,
      iaLog: `IA evaluated ${humanizeInt(window.evaluatedMoves)} possible moves in ${humanizeMs(end-start)}.`,
      turn: this.state.turn + 1,
      iaComputing: false
    }, () => {
      const won = hasWon(this.state.board, true);
      if (false !== won) {
        alert(`Congrats IA, you won! Guillaume is proud of you!`);
        this.setState({ needRestart: true, chosen: false, won });
        logGameResult(false, iaLevel);
      }
    });
  }

  undoMove () {
    const { board, players, turn } = this.state;
    undoMove(board, players[1], players[1].lastPlay.piece, players[1].lastPlay.x, players[1].lastPlay.y);
    undoMove(board, players[0], players[0].lastPlay.piece, players[0].lastPlay.x, players[0].lastPlay.y);

    this.setState({
      board,
      players,
      turn: turn - 2
    });
  }

  renderGrid (board) {
    const cells = [];
    const { chosen, won } = this.state;

    for (let i = 0; i <= 3; i++)
      for (let j = 0; j <= 3; j++)
        cells.push(<Cell chosen={chosen} won={won} key={`${i}:${j}`} x={i} y={j} board={board} onCellClick={() => this.onCellClick(i, j)} />)

    return cells;
  }

  render () {
    const { board, players, turn, chosen } = this.state;
    const { x, y } = chosen;
    const currentPlayer = players[turn%2];
    let allowedPieces = chosen ? uniq(currentPlayer.pieces).filter(piece => isPieceAllowed(board, x, y, piece, currentPlayer.color)) : [];

    return (
      <div className="Game">

        <div className="Parameters">
          <div className="HumanOrIa">
            <span>Player vs.</span>
            <span>
              Player<input type="radio" name="player2" value="IA" checked={!this.state.withIA} onChange={() => this.setState({ withIA: false })} />
              IA<input type="radio" name="player2" value="human" checked={this.state.withIA} onChange={() => this.setState({ withIA: true })} />
            </span>
          </div>
          {this.state.withIA &&
            <div className="IALevel">
              <label htmlFor="ia_level">IA Difficulty</label>
              <select id="ia_level" name="ia_level" value={this.state.iaLevel} onChange={event => this.setState({ iaLevel: parseInt(event.target.value, 10) }) }>
                <option value={IA_DEPTH_EASY}>Easy</option>
                <option value={IA_DEPTH_MEDIUM}>Medium</option>
                <option value={IA_DEPTH_HARD}>Hard</option>
              </select>
              IA plays first <input
                type="checkbox"
                defaultChecked={this.state.iaFirst}
                onChange={() => this.onIAFirstChange()} />
            </div>
          }

          {!this.state.needRestart &&
            <div>
              <span>Player {currentPlayer.color} turn</span>
              {players[0].lastPlay && players[1].lastPlay &&
                <button onClick={() => this.undoMove()}>Undo previous</button>
              }
            </div>
          }

          {this.state.needRestart &&
            <button onClick={() => {
              this.setState({
                ...this.state,
                ...getDefaultState()
              });
              if (this.state.iaFirst)
                setTimeout(() => this.iaFirst(), 300);
            }}>New game!</button>
          }
        </div>

        <div className="Board">

        {this.renderGrid(board)}

        </div>

        <div className="Controls">
          {this.state.iaComputing &&
            <small>IA is computing..</small>
          }
          {this.state.iaLog && !this.state.iaComputing &&
            <small>{this.state.iaLog}</small>
          }

          <div className="Choice">
            {chosen &&
              <div>
                <div className="Choice-title">Allowed pieces</div>
                <div className="Close" onClick={() => this.setState({ chosen: false })}>X</div>
                <div className="Choice-pieces">
                  {!allowedPieces.length &&
                    <span>None! 😰</span>
                  }
                  {allowedPieces.map((piece, i) => {
                    if (!isPieceAllowed(board, x, y, piece, currentPlayer.color))
                      return false;
                    return <Piece key={i} color={currentPlayer.color} type={piece} allowed={true} onPieceClick={() => this.onPieceClick(piece, i) } />
                  })}
                </div>
              </div>
            }
          </div>
        </div>

        <div className="Version">v0.4.0</div>
      </div>
    );
  }
}

export default Game;
