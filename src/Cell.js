import React from 'react';

import Piece from './Piece'

import { getZone } from './tools'

import './Cell.css';

function Cell({x, y, board, onCellClick, chosen, won }) {
  const isChosen = x === chosen.x && y === chosen.y;
  const zone = getZone(x, y);
  let isWinningCell = false;

  if (won) {
    if (
        (won.what === 'row' && won.where === x) ||
        (won.what === 'col' && won.where === y) ||
        (won.what === 'zone' && won.where === zone)
      ) {
      isWinningCell = true;
    }
  }

  return (
    <div className={`Cell CellX--${x} CellY--${y} CellZone--${zone} Cell--${isChosen ? 'chosen' : 'notChosen'} Cell--${isWinningCell ? 'winning' : 'notWinning'}`} onClick={onCellClick}>
      {board && board[x][y] &&
        <Piece type={board[x][y].piece} color={board[x][y].color} />
      }
    </div>
  );
}

export default Cell;
