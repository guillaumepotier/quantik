import remove from 'lodash/remove'

import {
  play,
  minmax,
  evaluate,
  WEIGHT,
  MALUS
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
  expect(evaluate(board, PLAYERS, PLAYERS[1], true)).toBe(WEIGHT - PLAYERS[1].pieces.length);

  board = [
    [{ piece: 'square', color: 'white' }, false, false, false],
    [{ piece: 'triangle', color: 'black' }, false, false, false],
    [{ piece: 'circle', color: 'white' }, false, false, false],
    [{ piece: 'cross', color: 'black' }, false, false, false]
  ];
  expect(evaluate(board, PLAYERS, PLAYERS[1], true)).toBe(WEIGHT - PLAYERS[1].pieces.length);

  board = [
    [{ piece: 'square', color: 'white' }, { piece: 'circle', color: 'white' }, false, false],
    [{ piece: 'triangle', color: 'black' }, { piece: 'cross', color: 'black' }, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(evaluate(board, PLAYERS, PLAYERS[1], true)).toBe(WEIGHT - PLAYERS[1].pieces.length);
});

test('evaluate non winning matches malus', () => {
  let board = [
    [{ piece: 'square', color: 'white' }, { piece: 'triangle', color: 'black' }, { piece: 'circle', color: 'white' }, false],
    [{ piece: 'cross', color: 'black' }, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(evaluate(board, PLAYERS, PLAYERS[1], true)).toBe(100);

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
  console.log(board, players[1].pieces);
  expect(evaluate(board, players, players[1], true)).toBe(-MALUS);
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
