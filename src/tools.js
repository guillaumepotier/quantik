import intersection from 'lodash/intersection';

import Player from './Player'

export const isPieceAllowed = (board, x, y, piece, color) => {
  let i, j;

  // check zone
  const zone = getZone(x, y);

  for (i = 0; i <= 3; i++) {
    for (j = 0; j <= 3; j++) {
      if (board[x][j] && board[x][j].piece === piece && board[x][j].color !== color)
        return false;
      if (board[i][y] && board[i][y].piece === piece && board[i][y].color !== color)
        return false;
      if (board[i][j] && getZone(i, j) === zone && board[i][j].piece === piece && board[i][j].color !== color)
        return false;
    }
  }

  return true;
}

export const isPieceAllowedOld = (board, x, y, piece, color) => {
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
      return 0;
    else
      return 2;
  } else {
    if (y <= 1)
      return 1;
    else
      return 3;
  }
}

export const hasWon = (board, which) => {
  let i, j;
  const rows = [[], [], [], []];
  const cols = [[], [], [], []];
  const zones = [[], [], [], []];
  const needed = ['square', 'triangle', 'circle', 'cross'];

  for (i = 0; i <= 3; i++) {
    for (j = 0; j <= 3; j++) {
      const piece = board[i][j].piece;

      if (!board[i][j])
        continue;

      rows[i].push(piece);
      cols[j].push(piece);
      zones[getZone(i, j)].push(piece);
    }
  }

  for (let k = 0; k <= 3; k++) {
    if (rows[k].length !== 4 && cols[k].length !== 4 && zones[k].length !== 4)
      continue;

    if (intersection(rows[k], needed).length === 4) {
      return which ? { what: 'row', where: k } : true;
    }
    if (intersection(cols[k], needed).length === 4) {
      return which ? { what: 'col', where: k } : true;
    }
    if (intersection(zones[k], needed).length === 4) {
      return which ? { what: 'zone', where: k } : true;
    }
  }

  return false;
}

export const getEmptyRowsAndColls = board => {
  const emptyRows = { 0: true, 1: true, 2: true, 3: true };
  const emptyColls = { 0: true, 1: true, 2: true, 3: true };

  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      if (board[i][j]) {
        emptyColls[j] = false;
        emptyRows[i] = false;
      }
    }
  }

  return { rows: emptyRows, cols: emptyColls };
}

export const hasWonOld = board => {
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
  ];
}

export const clonePlayer = player => {
  const newPlayer = new Player(player.color);
  newPlayer.pieces = player.pieces.slice();

  return newPlayer;
}

export const removePlayerPieceOld = (player, piece) => {
  let index;

  for (let i = 0; i < player.pieces.length; i++) {
    if (player.pieces[i] === piece) {
      index = i;
      break;
    }
  }

  player.pieces.splice(index, 1);
}

export const removePlayerPiece = (player, piece) => {
  player.pieces.splice(player.pieces.findIndex(p => p === piece), 1);
}

export const doMove = (board, player, piece, x, y) => {
  board[x][y] = { piece, color: player.color };
  removePlayerPiece(player, piece);
  player.lastPlay = { piece, x, y };
}

export const undoMove = (board, player, piece, x, y) => {
  board[x][y] = false;
  player.pieces.push(piece);
  player.lastPlay = false;
}

export const humanizeInt = int => {
  if (int <= 1000)
    return int;
  if (int <= 1000000)
    return `${Math.floor(int/1000)}k+`;

  const M = Math.floor(int/1000000);
  const k = Math.floor((int-M*1000000)/100000);
  return `${M},${k}M+`;
}

export const humanizeMs = ms => {
  if (ms <= 1000)
    return `${ms}ms`;

  const S = Math.floor(ms/1000);
  const s = Math.floor((ms - S*1000)/100);
  return `${S},${s}s`;
}

export const logGameResult = (hasWon, iaDifficulty, iaFirst) => {
  let history = JSON.parse(window.localStorage.getItem('quantik:results')) || [];
  history.push({ w: hasWon, d: iaDifficulty, t: (new Date()).getTime(), f: !iaFirst });
  window.localStorage.setItem('quantik:results', JSON.stringify(history));
}

export const getGameResults = () => {
  return JSON.parse(window.localStorage.getItem('quantik:results')) || [];
}

window.doMove = doMove;
window.players = [
  new Player('white'),
  new Player('black')
];
