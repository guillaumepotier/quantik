import remove from 'lodash/remove'

import {
  IA,
  playv2,
  minmax,
  minmaxv2,
  evaluate,
  WEIGHT,
  getAvailableSituations,
  maxMinmaxv2,
  minMinmaxv2
} from './ia'

import {
  hasWon,
  hasWonOld,
  removePlayerPiece,
  removePlayerPieceOld,
  doMove,
  cloneBoard,
  clonePlayer,
  isPieceAllowed,
  isPieceAllowedOld
} from './tools'

import Player from './Player';

const PLAYERS = [
  new Player('white'),
  new Player('black')
];

const ia = new IA();

test('evaluate winning matches for IA', () => {
  let board = [
    [{ piece: 'square', color: 'white' }, { piece: 'triangle', color: 'black' }, { piece: 'circle', color: 'white' }, { piece: 'cross', color: 'black' }],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(ia.evaluate(board, PLAYERS, true)).toBe(WEIGHT - PLAYERS[1].pieces.length);

  board = [
    [{ piece: 'square', color: 'white' }, false, false, false],
    [{ piece: 'triangle', color: 'black' }, false, false, false],
    [{ piece: 'circle', color: 'white' }, false, false, false],
    [{ piece: 'cross', color: 'black' }, false, false, false]
  ];
  expect(ia.evaluate(board, PLAYERS, true)).toBe(WEIGHT - PLAYERS[1].pieces.length);

  board = [
    [{ piece: 'square', color: 'white' }, { piece: 'circle', color: 'white' }, false, false],
    [{ piece: 'triangle', color: 'black' }, { piece: 'cross', color: 'black' }, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(ia.evaluate(board, PLAYERS, true)).toBe(WEIGHT - PLAYERS[1].pieces.length);
});

test('getAvailableSituations', () => {
  const board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  const white = new Player('white');
  const black = new Player('black');
  const players = [ white, black ];
  expect(ia.getAvailableSituations(board, players, false).length).toBe(64);

  doMove(board, white, 'triangle', 2, 2);

  expect(ia.getAvailableSituations(board, players, false).length).toBe(60);
  expect(ia.getAvailableSituations(board, players, true).length).toBe(53);

  // hack turn 2
  expect(ia.getAvailableSituations(board, players, true, true).length).toBe(35);

  doMove(board, white, 'triangle', 0, 0);

  const availableSituations = ia.getAvailableSituations(board, players, false);
  expect(availableSituations.length).toBe(42);
  // expect(availableSituations[0].players[0].pieces.length).toBe(5);

  const availableSituationsWithTriangle = availableSituations.filter(({ piece }) => piece === 'triangle');
  expect(availableSituationsWithTriangle.length).toBe(0);

  // console.log('>>> availableSituations', getAvailableSituations(board, players, false)[0].players[0]);

  // hack turn2
});

test('max', () => {
  const board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  const white = new Player('white');
  const black = new Player('black');
  const players = [ white, black ];

  doMove(board, white, 'square', 0, 0);
  doMove(board, black, 'circle', 0, 1);
  doMove(board, white, 'triangle', 0, 2);

  const availableSituations = ia.getAvailableSituations(board, players, true);

  // const cornerSituations = availableSituations.filter(({ x, y }) => x === 0 && y === 3);
  // console.log('cornerSituations', cornerSituations);

  // console.log('situation1', evaluate(cornerSituations[0].board, cornerSituations[0].players, true));
  // console.log('situation2',evaluate(cornerSituations[1].board, cornerSituations[1].players, true));

  // console.log('situation1.2', minmaxv2(cornerSituations[0].board, 0, cornerSituations[0].players, true));
  // console.log('situation2.2', minmaxv2(cornerSituations[1].board, 0, cornerSituations[1].players, true));

  // const maxBestCornerSituations = maxMinmaxv2(cornerSituations, 0, players, true);
  // console.log('maxBestCornerSituations', maxBestCornerSituations.best, maxBestCornerSituations.bestSituation);


  const { best, bestSituation } = ia.max(availableSituations, 0, board, players);

  // console.log('>>> bestSituation', best, bestSituation)

  expect(best).toBe(WEIGHT-black.pieces.length+1);
  expect(bestSituation.x).toBe(0);
  expect(bestSituation.y).toBe(3);
  expect(bestSituation.piece).toBe('cross');
});

test('min', () => {
  const board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  const white = new Player('white');
  const black = new Player('black');
  const players = [ white, black ];

  doMove(board, white, 'square', 0, 0);
  doMove(board, black, 'circle', 0, 1);
  doMove(board, white, 'triangle', 0, 2);
  doMove(board, black, 'cross', 3, 0);

  const availableSituations = ia.getAvailableSituations(board, players, false);
  const { best, bestSituation } = ia.min(availableSituations, 0, board, players);

  expect(best).toBe(-WEIGHT+white.pieces.length-1);
});

test('play', () => {
  const board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  const white = new Player('white');
  const black = new Player('black');
  const players = [ white, black ];
  doMove(board, white, 'square', 0, 0);

  let state = ia.play({ board, players }, 0);
  // console.log(state.board);
});

test.skip('playv2 debug', () => {
  let board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  let white = new Player('white');
  let black = new Player('black');
  let players = [ white, black ];

  doMove(board, white, 'triangle', 2, 0);
  doMove(board, black, 'circle', 2, 1);
  doMove(board, white, 'square', 0, 3);

  console.log('>> board', board);

  /*
  | | | |◻︎|
  ---------
  | | | | |
  ---------
  |△|●| | |
  ---------
  | | | | |
  */

  // const clone2 = cloneBoard(board);

  // console.log('>>>> cest parti');
  // console.log(playv2({ board: clone2, players }, 1, true));
  let availableSituations = getAvailableSituations(board, players, true);
  // let circleSituation = availableSituations.find(({x, y, piece}) => {
  //   return x === 2 && y === 2 && piece === 'circle';
  // });
  // let circleSituations = availableSituations.filter(({ piece }) => piece === 'circle');
  // console.log('circleSituations length', circleSituations.length);

  // for (let k = 0; k < circleSituations.length; k++)
  //   console.log(`>> circleSituation #${k}`, circleSituations[k].players[1].pieces);

  // console.log('circleSituation', circleSituation, circleSituation.players[0].pieces, circleSituation.players[1].pieces);

  let debug = playv2({ board, players }, 1, true);
  console.log('>> debug', debug);

  /*
  | | | |●|
  ---------
  | |△| | |
  ---------
  |▲|○| | |
  ---------
  | | | |◇|
  */
  // board = [
  //   [false, false, false, false],
  //   [false, false, false, false],
  //   [false, false, false, false],
  //   [false, false, false, false]
  // ];
  // white = new Player('white');
  // black = new Player('black');
  // players = [ white, black ];

  // doMove(board, white, 'circle', 2, 1);
  // doMove(board, black, 'triangle', 2, 0);
  // doMove(board, white, 'triangle', 1, 1);
  // doMove(board, black, 'circle', 0, 3);
  // doMove(board, white, 'cross', 3, 3);

  // console.log('board2', board);
  // // debug = playv2({ board, players }, 4, true);
  // doMove(board, black, 'square', 1, 0);

  // debug = playv2({ board, players }, 4, true);
  // console.log('>> debug2', debug);

  /*
  | |◆| | |
  ---------
  | |△| | |
  ---------
  | |○| |▲|
  ---------
  |◇| | |◼︎|
  */
  board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  white = new Player('white');
  black = new Player('black');
  players = [ white, black ];

  doMove(board, white, 'cross', 0, 1);
  doMove(board, black, 'triangle', 1, 1);
  doMove(board, black, 'circle', 2, 1);
  doMove(board, white, 'triangle', 2, 3);
  doMove(board, black, 'cross', 3, 0);
  doMove(board, white, 'square', 3, 3);

  debug = playv2({ board, players }, 5, true);
  console.log('>> debug2', debug);
});

test.skip('perfs', () => {
  let start, stop;
  let board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  let white = new Player('white');
  let black = new Player('black');
  let players = [ white, black ];

  doMove(board, white, 'triangle', 2, 0);
  doMove(board, black, 'circle', 2, 1);
  doMove(board, white, 'square', 0, 3);

/*

  // => 35278ms hasWonOld
  // => 9126ms hasWon before length4 test
  // => 351ms now \o/
  start = new Date();
  for (let i = 0; i <= 1000000; i++)
    hasWon(board);
  stop = new Date();
  console.log(`hasWon took ${stop-start}ms to execute`);

  // => 35278ms
  // start = new Date();
  // for (let i = 0; i <= 1000000; i++)
  //   hasWonOld(board);
  // stop = new Date();
  // console.log(`hasWonOld took ${stop-start}ms to execute`);

  start = new Date();
  for (let i = 0; i <= 1000000; i++)
    removePlayerPiece(new Player('white'), 'triangle');
  stop = new Date();
  console.log(`removePlayerPiece took ${stop-start}ms to execute`);

  start = new Date();
  for (let i = 0; i <= 1000000; i++)
    removePlayerPieceOld(new Player('white'), 'triangle');
  stop = new Date();
  console.log(`removePlayerPieceOld took ${stop-start}ms to execute`);

  start = new Date();
  for (let i = 0; i <= 1000000; i++)
    isPieceAllowedOld(board, 3, 3, 'square', 'black')
  stop = new Date();
  console.log(`isPieceAllowed took ${stop-start}ms to execute`);

  start = new Date();
  for (let i = 0; i <= 1000000; i++)
    isPieceAllowedOld(board, 3, 3, 'square', 'black')
  stop = new Date();
  console.log(`isPieceAllowedOld took ${stop-start}ms to execute`);

  // 26750ms
  // 21964ms stoping cloning not playing user
  start = new Date();
  let situations;
  for (let i = 0; i <= 1000000; i++)
    situations = getAvailableSituations(board, players, true);
  stop = new Date();
  console.log(`getAvailableSituations took ${stop-start}ms to execute`);


  // 157 ms
  start = new Date();
  for (let i = 0; i <= 1000000; i++)
    cloneBoard(board);
  stop = new Date();
  console.log(`cloneBoard took ${stop-start}ms to execute`);

  start = new Date();
  for (let i = 0; i <= 1000000; i++)
    clonePlayer(players[0]);
  stop = new Date();
  console.log(`clonePlayer took ${stop-start}ms to execute`);

*/

  // => 51615ms
  // => 45289ms
  // => 29865ms by forbidding to play same shape
  // => 6646ms by forcing to play a corner
  // => 4174ms by not evaluating hasWon twice
  // start = new Date();
  // playv2({ board, players }, 5, true);
  // stop = new Date();
  // console.log(`playv2 depth 5 took ${stop-start}ms to execute`);

});

test.skip('debug alpha beta pruning', () => {
  let start, stop;
  let board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  let white = new Player('white');
  let black = new Player('black');
  let players = [ white, black ];

  doMove(board, white, 'cross', 0, 3);
  doMove(board, black, 'square', 0, 1);
  doMove(board, white, 'triangle', 3, 3);

  const state = ia.play({ board, players }, 5, true);
  console.log(state);

});
