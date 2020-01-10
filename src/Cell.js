import React from 'react';

import Piece from './Piece'

import { getZone } from './tools'

import './Cell.css';

function Cell({x, y, board, onCellClick }) {
  return (
    <div className={`Cell CellX--${x} CellY--${y} CellZone--${getZone(x, y)}`} onClick={onCellClick}>
      {board && board[x][y] &&
        <Piece type={board[x][y].piece} color={board[x][y].color} />
      }
    </div>
  );
}

export default Cell;
