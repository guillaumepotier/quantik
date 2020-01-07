import React from 'react';

import Cell from './Cell';
import Zone from './Zone';
import Piece from './Piece';

import Player from './Player';

import {
  hasWon,
  isPieceAllowed
} from './tools';

import './Game.css';

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
  choose: false
});

class Game extends React.Component {
  constructor (args) {
    super(args);

    this.state = getDefaultState();
  }

  onCellClick (x, y) {
    if (this.state.board[x][y])
      return;

    this.setState({ choose: {x, y} });
  }

  onPieceClick (piece, i) {
    let { choose, turn, players, board } = this.state;
    const { x, y } = choose;
    let currentPlayer = players[turn%2];

    board[x][y] = { piece, color: currentPlayer.color };
    currentPlayer.pieces.splice(i, 1);

    if (hasWon(board)) {
      alert(`Congrats player ${currentPlayer.color}!`);
      this.setState(getDefaultState());
      return;
    }

    this.setState({
      board,
      turn: turn + 1,
      choose: false
    });
  }

  render () {
    const { board, players, turn, choose } = this.state;
    const { x, y } = choose;
    const currentPlayer = players[turn%2];

    return (
      <div className="Game">

        <div className="Board">

          <Zone name="3">
            <Cell x={0} y={3} board={board} onCellClick={() => this.onCellClick(0, 3)} />
            <Cell x={1} y={3} board={board} onCellClick={() => this.onCellClick(1, 3)} />
            <Cell x={0} y={2} board={board} onCellClick={() => this.onCellClick(0, 2)} />
            <Cell x={1} y={2} board={board} onCellClick={() => this.onCellClick(1, 2)} />
          </Zone>

          <Zone name="4">
            <Cell x={2} y={3} board={board} onCellClick={() => this.onCellClick(2, 3)} />
            <Cell x={3} y={3} board={board} onCellClick={() => this.onCellClick(3, 3)} />
            <Cell x={2} y={2} board={board} onCellClick={() => this.onCellClick(2, 2)} />
            <Cell x={3} y={2} board={board} onCellClick={() => this.onCellClick(3, 2)} />
          </Zone>

          <Zone name="1">
            <Cell x={0} y={1} board={board} onCellClick={() => this.onCellClick(0, 1)} />
            <Cell x={1} y={1} board={board} onCellClick={() => this.onCellClick(1, 1)} />
            <Cell x={0} y={0} board={board} onCellClick={() => this.onCellClick(0, 0)} />
            <Cell x={1} y={0} board={board} onCellClick={() => this.onCellClick(1, 0)} />
          </Zone>

          <Zone name="2">
            <Cell x={2} y={1} board={board} onCellClick={() => this.onCellClick(2, 1)} />
            <Cell x={3} y={1} board={board} onCellClick={() => this.onCellClick(3, 1)} />
            <Cell x={2} y={0} board={board} onCellClick={() => this.onCellClick(2, 0)} />
            <Cell x={3} y={0} board={board} onCellClick={() => this.onCellClick(3, 0)} />
          </Zone>

        </div>

        <div className="Controls">
          Player {currentPlayer.color} turn

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
