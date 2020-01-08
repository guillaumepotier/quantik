import uniq from 'lodash/uniq';
import lastIndexOf from 'lodash/lastIndexOf';

import {
  cloneBoard,
  clonePlayer,
  hasWon,
  doMove,
  isPieceAllowed
} from './tools'

export const WEIGHT = 1000;
export const MALUS = 69;

export const play = (state, depth) => {
  let bestScore = 0;
  let bestPiece = false;
  let bestCoordinates = false;

  let players = Object.assign({}, state.players);
  let currentPlayer = clonePlayer(players[1]);  // IA is black for now on
  let pieces = uniq(currentPlayer.pieces);

  for (var i = 0; i <= 3; i++) {
    for (var j = 0; j <= 3; j++) {
      let board = cloneBoard(state.board);

      // if already a piece on this case, not playable
      if (board[i][j])
        continue;

      // loop for each remaining pieces and try to evaluate the play
      for (var p = 0; p < pieces.length; p++) {
        const piece = pieces[p];
        currentPlayer = clonePlayer(players[1]);

        if (!isPieceAllowed(board, i, j, piece, currentPlayer.color))
          continue;

        doMove(board, currentPlayer, piece, i, j);
        const val = minmax(board, depth, players, currentPlayer, true);

        console.log(`${pieces[p]}:${i},${j}`, val);

        if (val > bestScore || (val === bestScore && Math.random() < 0.1)) {
          bestScore = val;
          bestPiece = piece;
          bestCoordinates = { x: i, y: j };
        }
      }
    }
  }

  console.log('bestScore', bestScore)

  doMove(state.board, state.players[1], bestPiece, bestCoordinates.x, bestCoordinates.y);

  return state;
}

export const minmax = (board, depth, players, playerIA, isIA) => {
  if (depth === 0 || hasWon(board))
    return evaluate(board, players, playerIA, isIA);
}

export const evaluate = (board, players, playerIA, isIA) => {
  const finished = hasWon(board);
  const player = isIA ? playerIA : players[0];

  if (!finished) {
    const malus = player.pieces.length >= 5 && uniq(player.pieces).length < 4;
    return malus ? (isIA ? -MALUS : MALUS) : 100;
  }

  if (isIA) {
    return WEIGHT - playerIA.pieces.length;
  }

  return -WEIGHT + players[0].pieces.length; // only black IA for now on
}
