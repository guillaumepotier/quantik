import React from 'react';

import Piece from './Piece'

import { getZone } from './tools'

import './Cell.css';

function Cell({x, y, board, onCellClick, chosen }) {
  const isChosen = x === chosen.x && y === chosen.y;

  return (
    <div className={`Cell CellX--${x} CellY--${y} CellZone--${getZone(x, y)} Cell--${isChosen ? 'chosen' : 'notChosen'}`} onClick={onCellClick}>
      {board && board[x][y] &&
        <Piece type={board[x][y].piece} color={board[x][y].color} />
      }
    </div>
  );
}

export default Cell;
