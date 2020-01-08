import intersection from 'lodash/intersection';

import Player from './Player'

export const isPieceAllowed = (board, x, y, piece, color) => {
  let i, j;

  // check row
  for (i = 0; i <= 3; i++)
    if (board[i][y] && board[i][y].piece === piece && board[i][y].color !== color)
      return false;

  // check coll
  for (j = 0; j <= 3; j++)
    if (board[x][j] && board[x][j].piece === piece && board[x][j].color !== color)
      return false;

  // check zone
  const zone = getZone(x, y);

  for (i = 0; i <= 3; i++)
    for (j = 0; j <= 3; j++)
      if (board[i][j] && getZone(i, j) === zone && board[i][j].piece === piece && board[i][j].color !== color)
        return false;

  return true;
}

export const getZone = (x, y) => {
  if (x <= 1) {
    if (y <= 1)
      return 1;
    else
      return 3;
  } else {
    if (y <= 1)
      return 2;
    else
      return 4;
  }
}

export const hasWon = board => {
  let i, j;
  const needed = ['square', 'triangle', 'circle', 'cross'];

  // test rows
  for (j = 0; j <= 3; j++) {
    let row = [];

    for (i = 0; i <= 3; i++)
      row.push(board[i][j].piece);

    if (intersection(row, needed).length === 4)
      return true;
  }

  // test cols
  for (i = 0; i <= 3; i++) {
    let col = [];

    for (j = 0; j <= 3; j++)
      col.push(board[i][j].piece);

    if (intersection(col, needed).length === 4)
      return true;
  }

  // test zones
  for (let z = 1; z <= 4; z++) {
    let zone = [];

    for (i = 0; i <= 3; i++)
      for (j = 0; j <= 3; j++)
        if (getZone(i, j) === z)
          zone.push(board[i][j].piece);

    if (intersection(zone, needed).length === 4)
      return true;
  }

  return false;
}

export const cloneBoard = board => {
  return [
    board[0].slice(),
    board[1].slice(),
    board[2].slice(),
    board[3].slice()
  ]
}

export const clonePlayer = player => {
  const newPlayer = new Player(player.color);
  newPlayer.pieces = player.pieces.slice();

  return newPlayer;
}

export const removePlayerPiece = (player, piece) => {
  let index;

  for (let i = 0; i < player.pieces.length; i++) {
    if (player.pieces[i] === piece) {
      index = i;
      break;
    }
  }

  player.pieces.splice(index, 1);
}

export const doMove = (board, player, piece, x, y) => {
  board[x][y] = { piece, color: player.color };
  removePlayerPiece(player, piece);
};
