import uniq from 'lodash/uniq';

import {
  cloneBoard,
  clonePlayer,
  hasWon,
  doMove,
  undoMove,
  isPieceAllowed
} from './tools'

export const WEIGHT = 1000;
export const MALUS = 69;

export const DEBUG = true;
window.evaluatedMoves = 0;

export const getAvailableSituations = (board, players, isIA, turn2) => {
  const situations = [];
  const currentPlayer = players[isIA ? 1 : 0];
  const pieces = uniq(currentPlayer.pieces);

  // const situationPlayers = [
  //   clonePlayer(players[0]),
  //   clonePlayer(players[1])
  // ];

  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      // if already a piece on this case, not playable
      if (board[i][j])
        continue;

      // on turn 2, consider only corners
      if (turn2 && (i === 1 || i === 2 || j === 1 || j === 2))
        continue;

      for (let p = 0; p < pieces.length; p++) {
        const piece = pieces[p];

        if (!isPieceAllowed(board, i, j, piece, currentPlayer.color))
          continue;

        // clone situation.board and situation.player to modify them
        // const situationBoard = cloneBoard(board);
        // situationPlayers[isIA ? 1 : 0] = clonePlayer(players[isIA ? 1 : 0]);

        // const situationPlayer = situationPlayers[isIA ? 1 : 0];

        // doMove(situationBoard, situationPlayer, piece, i, j);

        situations.push({
          // board: situationBoard,
          // players: situationPlayers,
          x: i,
          y: j,
          piece
        });
      }
    }
  }

  return situations;
}

export const playv2 = (state, depth, debug) => {
  let best = false;
  let bestSituation = false;
  let situations = getAvailableSituations(state.board, state.players, true);

  const players = [
    clonePlayer(state.players[0]),
    clonePlayer(state.players[1])
  ];

  if (debug) {
    var debugBoard = [
      [{}, {}, {}, {}],
      [{}, {}, {}, {}],
      [{}, {}, {}, {}],
      [{}, {}, {}, {}]
    ];
  }

  // first move is not important, do not make many iterations
  if (state.players[1].pieces.length === 8)
    depth = 0;

  // for second move, only consider playing corners and decr depth
  if (state.players[1].pieces.length === 7) {
    depth = Math.max(0, depth - 1);
    situations = getAvailableSituations(state.board, state.players, true, true);
  }

  for (let i = 0; i < situations.length; i++) {
    const situation = situations[i];

    doMove(state.board, players[1], situation.piece, situation.x, situation.y);
    const val = minmaxv2(state.board, depth, players, true);
    undoMove(state.board, players[1], situation.piece, situation.x, situation.y);

    if (debug)
      debugBoard[situation.x][situation.y][situation.piece] = val;

    if (best === false || val > best || (val === best && Math.random() < 0.1)) {
      best = val;
      bestSituation = situation;
    }
  }

  // No more move possible for IA, it losts!
  if (bestSituation === false)
    return false;

  doMove(state.board, state.players[1], bestSituation.piece, bestSituation.x, bestSituation.y);

  if (debug) {
    console.log('playv2 best situation', bestSituation.x, bestSituation.y, bestSituation.piece, best);
    return debugBoard;
  }

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

export const maxMinmaxv2 = (situations, depth, board, players) => {
  let best = false;
  let bestSituation;

  for (let i = 0; i < situations.length; i++) {
    const currentSituation = situations[i];

    doMove(board, players[1], currentSituation.piece, currentSituation.x, currentSituation.y);
    const value = minmaxv2(board, depth, players, true);
    undoMove(board, players[1], currentSituation.piece, currentSituation.x, currentSituation.y);

    if (best === false || value > best || (value === best && Math.random() < 0.1)) {
      best = value;
      bestSituation = currentSituation;
    }

    if (best >= WEIGHT - 8)
      break;
  }

  return { best, bestSituation };
}

export const minMinmaxv2 = (situations, depth, board, players) => {
  let best = false;
  let bestSituation;

  for (let i = 0; i < situations.length; i++) {
    const currentSituation = situations[i];

    doMove(board, players[0], currentSituation.piece, currentSituation.x, currentSituation.y);
    const value = minmaxv2(board, depth, players, false);
    undoMove(board, players[0], currentSituation.piece, currentSituation.x, currentSituation.y);

    if (best === false || value < best || (value === best && Math.random() < 0.1)) {
      best = value;
      bestSituation = currentSituation;
    }

    if (best <= - WEIGHT + 8)
      break;
  }

  return { best, bestSituation };
}

export const minmaxv2 = (board, depth, players, isIA) => {
  if (depth === 0 || hasWon(board))
    return evaluate(board, players, isIA);

  // get next player situations
  // ie: if we're currently evaluating an ia move, consider player next situations
  const situations = getAvailableSituations(board, players, !isIA);

  // const { best, bestSituation } = maxMinmaxv2(situations, depth - 1, players, !isIA);
  // return best;

  if (isIA) {
    const { best, bestSituation } = minMinmaxv2(situations, depth - 1, board, players);
    // console.log('>>>> isIA best', best, bestSituation)
    return best;
  } else {
    const { best, bestSituation } = maxMinmaxv2(situations, depth - 1, board, players);
    // console.log('isPlayer best', best, bestSituation)
    return best;
  }
}

export const minmax = (board, depth, players, playerIA, isIA) => {
  if (depth === 0 || hasWon(board))
    return evaluate(board, players, isIA);
}

// todo: won't work, need to fake play turn to have proper player.pieces count
export const evaluate = (board, players, isIA) => {
  const finished = hasWon(board);
  window.evaluatedMoves++;

  if (!finished) {
    return 100;
  }

  if (isIA) {
    return WEIGHT - players[1].pieces.length;
  }

  return -WEIGHT + players[0].pieces.length;
}

window.board = [
  [false, false, false, { piece: 'square', color: 'white' }],
  [false, false, false, false],
  [{ piece: 'triangle', color: 'white' }, { piece: 'circle', color: 'black' }, false, false],
  [false, false, false, false]
];
window.evaluate = evaluate;
window.playv2 = playv2;
window.getAvailableSituations = getAvailableSituations;
window.minmaxv2 = minmaxv2;
window.maxMinmaxv2 = maxMinmaxv2;
window.minMinmaxv2 = minMinmaxv2;
