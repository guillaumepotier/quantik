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

export const getAvailableSituations = (board, players, isIA) => {
  const situations = [];
  const situationPlayers = [
    clonePlayer(players[0]),
    clonePlayer(players[1])
  ];
  const currentPlayer = players[isIA ? 1 : 0];
  const pieces = uniq(currentPlayer.pieces);

  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      // if already a piece on this case, not playable
      if (board[i][j])
        continue;

      for (let p = 0; p < pieces.length; p++) {
        const piece = pieces[p];

        if (!isPieceAllowed(board, i, j, piece, currentPlayer.color))
          continue;

        // clone situation.board and situation.player to modify them
        const situationBoard = cloneBoard(board);
        situationPlayers[isIA ? 1 : 0] = clonePlayer(players[isIA ? 1 : 0]);

        doMove(situationBoard, situationPlayers[isIA ? 1 : 0], piece, i, j);

        situations.push({
          board: situationBoard,
          players: situationPlayers,
          x: i,
          y: j,
          piece
        });
      }
    }
  }

  return situations;
}

export const playv2 = (state, depth) => {
  let best = 0;
  let bestSituation;
  const situations = getAvailableSituations(state.board, state.players, true);

  for (let i = 0; i < situations.length; i++) {
    const situation = situations[i];
    const val = minmaxv2(situation.board, depth, situation.players, true);

    if (val > best || (val === best && Math.random() < 0.1)) {
      best = val;
      bestSituation = situation;
    }
  }

  doMove(state.board, state.players[1], bestSituation.piece, bestSituation.x, bestSituation.y);

  return state;
}

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

        // console.log(`${pieces[p]}:${i},${j}`, val);

        if (val > bestScore || (val === bestScore && Math.random() < 0.1)) {
          bestScore = val;
          bestPiece = piece;
          bestCoordinates = { x: i, y: j };
        }
      }
    }
  }

  // console.log('bestScore', bestScore)

  doMove(state.board, state.players[1], bestPiece, bestCoordinates.x, bestCoordinates.y);

  return state;
}

export const maxMinmaxv2 = (situations, depth, players, isIA) => {
  let best = 0;
  let bestSituation;

  for (let i = 0; i < situations.length; i++) {
    const currentSituation = situations[i];
    const value = minmaxv2(currentSituation.board, depth, currentSituation.players, isIA);
    if (value > best || (value === best && Math.random() < 0.1)) {
      best = value;
      bestSituation = currentSituation;
    }
  }

  return { best, bestSituation };
}

export const minMinmaxv2 = (situations, depth, players, isIA) => {
  let best = 0;
  let bestSituation;

  for (let i = 0; i < situations.length; i++) {
    const currentSituation = situations[i];
    const value = minmaxv2(currentSituation.board, depth, currentSituation.players, isIA);
    if (value < best || (value === best && Math.random() < 0.1)) {
      best = value;
      bestSituation = currentSituation;
    }
  }

  return { best, bestSituation };
}

export const minmaxv2 = (board, depth, players, isIA) => {
  if (depth === 0 || hasWon(board))
    return evaluate(board, players, isIA);

  // get next player situations
  // ie: if we're currently evaluating an ia move, consider player next situations
  const situations = getAvailableSituations(board, players, isIA);

  if (isIA) {
    const { best, bestSituation } = maxMinmaxv2(situations, depth - 1, players, !isIA);
    return best;
  } else {
    const { best, bestSituation } = minMinmaxv2(situations, depth - 1, players, isIA);
    return best;
  }
}

export const minmax = (board, depth, players, playerIA, isIA) => {
  if (depth === 0 || hasWon(board))
    return evaluate(board, players, isIA);
}

export const evaluate = (board, players, isIA) => {
  const finished = hasWon(board);
  const player = players[isIA ? 1 : 0];

  if (!finished) {
    const malus = player.pieces.length >= 5 && uniq(player.pieces).length < 4;
    return malus ? (isIA ? -MALUS : MALUS) : 100;
  }

  if (isIA) {
    return WEIGHT - players[1].pieces.length;
  }

  return -WEIGHT + players[0].pieces.length;
}
