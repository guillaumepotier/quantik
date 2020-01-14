import uniq from 'lodash/uniq';

import {
  clonePlayer,
  hasWon,
  doMove,
  undoMove,
  isPieceAllowed,
  getEmptyRowsAndColls
} from './tools'

export const WEIGHT = 1000;
export const MALUS = 69;

export const DEBUG = true;
window.evaluatedMoves = 0;


export class IA {
  getAvailableSituations (board, players, isIA, turn2) {
    const situations = [];
    const currentPlayer = players[isIA ? 1 : 0];
    const pieces = uniq(currentPlayer.pieces);

    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        // if already a piece on this case, not playable
        if (board[i][j])
          continue;

        // on turn 2, consider only playing on empty rows and cols
        if (turn2) {
          const { rows, cols } = getEmptyRowsAndColls(board);

          if (!rows[i] || !cols[j])
            continue;
        }

        for (let p = 0; p < pieces.length; p++) {
          const piece = pieces[p];

          if (!isPieceAllowed(board, i, j, piece, currentPlayer.color))
            continue;

          situations.push({ x: i, y: j, piece });
        }
      }
    }

    return situations;
  }

  play (state, depth, debug) {
    this.evaluatedMoves = 0;

    let best = false;
    let bestSituation = false;
    let situations = this.getAvailableSituations(state.board, state.players, true);

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

    // for second move, only consider playing on empty rows and cols
    if (state.players[1].pieces.length === 7) {
      depth = Math.max(0, depth - 1);
      situations = this.getAvailableSituations(state.board, state.players, true, true);
    }

    for (let i = 0; i < situations.length; i++) {
      const situation = situations[i];

      doMove(state.board, players[1], situation.piece, situation.x, situation.y);
      const val = this.minmax(state.board, depth, players, true);
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

  max (situations, depth, board, players) {
    let best = false;
    let bestSituation;

    for (let i = 0; i < situations.length; i++) {
      const currentSituation = situations[i];

      doMove(board, players[1], currentSituation.piece, currentSituation.x, currentSituation.y);
      const value = this.minmax(board, depth, players, true);
      undoMove(board, players[1], currentSituation.piece, currentSituation.x, currentSituation.y);

      if (best === false || value > best || (value === best && Math.random() < 0.1)) {
        best = value;
        bestSituation = currentSituation;
      }

      if (best >= WEIGHT - players[1].pieces.length)
        break;
    }

    return { best, bestSituation };
  }

  min (situations, depth, board, players) {
    let best = false;
    let bestSituation;

    for (let i = 0; i < situations.length; i++) {
      const currentSituation = situations[i];

      doMove(board, players[0], currentSituation.piece, currentSituation.x, currentSituation.y);
      const value = this.minmax(board, depth, players, false);
      undoMove(board, players[0], currentSituation.piece, currentSituation.x, currentSituation.y);

      if (best === false || value < best || (value === best && Math.random() < 0.1)) {
        best = value;
        bestSituation = currentSituation;
      }

      if (best <= - WEIGHT - players[0].pieces.length)
        break;
    }

    return { best, bestSituation };
  }

  minmax (board, depth, players, isIA) {
    const finished = hasWon(board);

    if (depth === 0 || finished)
      return this.evaluate(board, players, isIA, finished);

    // get next player situations
    // ie: if we're currently evaluating an ia move, consider player next situations
    const situations = this.getAvailableSituations(board, players, !isIA);

    // const { best, bestSituation } = maxMinmaxv2(situations, depth - 1, players, !isIA);
    // return best;

    if (isIA) {
      const { best } = this.min(situations, depth - 1, board, players);
      // const { best, bestSituation } = this.min(situations, depth - 1, board, players);
      // console.log('>>>> isIA best', best, bestSituation)
      return best;
    } else {
      const { best } = this.max(situations, depth - 1, board, players);
      // const { best, bestSituation } = this.max(situations, depth - 1, board, players);
      // console.log('isPlayer best', best, bestSituation)
      return best;
    }
  }

  evaluate (board, players, isIA, finished) {
    this.evaluatedMoves++;
    finished = typeof finished === 'undefined' ? hasWon(board) : finished;

    if (!finished) {
      return 100;
    }

    return (isIA ? 1 : -1) * (WEIGHT - players[isIA ? 1 : 0].pieces.length);
  }
}
