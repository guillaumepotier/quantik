import remove from 'lodash/remove'

import {
  play,
  playv2,
  minmax,
  evaluate,
  WEIGHT,
  MALUS,
  getAvailableSituations,
  maxMinmaxv2,
  minMinmaxv2
} from './ia'

import {
  hasWon,
  removePlayerPiece,
  doMove
} from './tools'

import Player from './Player';

const PLAYERS = [
  new Player('white'),
  new Player('black')
];

test('evaluate winning matches for IA', () => {
  let board = [
    [{ piece: 'square', color: 'white' }, { piece: 'triangle', color: 'black' }, { piece: 'circle', color: 'white' }, { piece: 'cross', color: 'black' }],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(evaluate(board, PLAYERS, true)).toBe(WEIGHT - PLAYERS[1].pieces.length);

  board = [
    [{ piece: 'square', color: 'white' }, false, false, false],
    [{ piece: 'triangle', color: 'black' }, false, false, false],
    [{ piece: 'circle', color: 'white' }, false, false, false],
    [{ piece: 'cross', color: 'black' }, false, false, false]
  ];
  expect(evaluate(board, PLAYERS, true)).toBe(WEIGHT - PLAYERS[1].pieces.length);

  board = [
    [{ piece: 'square', color: 'white' }, { piece: 'circle', color: 'white' }, false, false],
    [{ piece: 'triangle', color: 'black' }, { piece: 'cross', color: 'black' }, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(evaluate(board, PLAYERS, true)).toBe(WEIGHT - PLAYERS[1].pieces.length);
});

test('evaluate non winning matches malus', () => {
  let board = [
    [{ piece: 'square', color: 'white' }, { piece: 'triangle', color: 'black' }, { piece: 'circle', color: 'white' }, false],
    [{ piece: 'cross', color: 'black' }, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(evaluate(board, PLAYERS, true)).toBe(100);

  board = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];

  // malus cuz' we used already two of the same pieces
  const players = [ new Player('white'), new Player('black') ];
  doMove(board, players[0], 'square', 0, 0);
  doMove(board, players[1], 'triangle', 0, 1);
  doMove(board, players[0], 'circle', 0, 2);
  doMove(board, players[1], 'triangle', 3, 3);
  // console.log(board, players[1].pieces);
  expect(evaluate(board, players, true)).toBe(-MALUS);
});

test('basic ia 0 depth', () => {
  const state = {
    board : [
      [{ piece: 'square', color: 'white' }, { piece: 'triangle', color: 'black' }, { piece: 'circle', color: 'white' }, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false]
    ],
    players: [
      new Player('white'),
      new Player('black')
    ]
  };
  const newState = play(state, 0);
  expect(hasWon(newState.board)).toBe(true);
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
  expect(getAvailableSituations(board, players, false).length).toBe(64);

  doMove(board, white, 'triangle', 2, 2);
  expect(getAvailableSituations(board, players, false).length).toBe(60);
  expect(getAvailableSituations(board, players, true).length).toBe(53);

  doMove(board, white, 'triangle', 0, 0);
  expect(getAvailableSituations(board, players, false).length).toBe(42);

  // console.log(getAvailableSituations(board, players, false)[0]);
});

test('maxMinmaxv2', () => {
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

  const availableSituations = getAvailableSituations(board, players, true);
  const { best, bestSituation } = maxMinmaxv2(availableSituations, 0, players, true);

  expect(best).toBe(WEIGHT-black.pieces.length+1);
  expect(bestSituation.x).toBe(0);
  expect(bestSituation.y).toBe(3);
  expect(bestSituation.piece).toBe('cross');
});

test('minMinmaxv2', () => {
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

  const availableSituations = getAvailableSituations(board, players, false);
  const { best, bestSituation } = minMinmaxv2(availableSituations, 0, players, false);

  expect(best).toBe(-WEIGHT+white.pieces.length-1);
});

test('playv2', () => {
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

  let state = playv2({ board, players }, 0);
  console.log(state.board);

  state = playv2({ board, players }, 1);
  console.log(state.board);
});
