import {
  hasWon,
  isPieceAllowed,
  cloneBoard,
  clonePlayer
} from './tools'

import Player from './player'

test('hasWon test', () => {
  let board = [
    [{ piece: 'square', color: 'white' }, { piece: 'triangle', color: 'black' }, { piece: 'circle', color: 'white' }, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(hasWon(board)).toBe(false);

  board[0][3] = { piece: 'cross', color: 'black' };
  expect(hasWon(board)).toBe(true);

  board = [
    [{ piece: 'square', color: 'white' }, { piece: 'triangle', color: 'white' }, false, false],
    [{ piece: 'circle', color: 'white' }, { piece: 'cross', color: 'white' }, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];
  expect(hasWon(board)).toBe(true);

  board = [
    [{ piece: 'square', color: 'white' }, false, false, false],
    [{ piece: 'triangle', color: 'white' }, false, false, false],
    [{ piece: 'circle', color: 'white' }, false, false, false],
    [{ piece: 'cross', color: 'white' }, false, false, false]
  ];
  expect(hasWon(board)).toBe(true);
});

test('isPieceAllowed', () => {
  let board = [
    [{ piece: 'square', color: 'white' }, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
  ];

  expect(isPieceAllowed(board, 0, 1, 'square', 'black')).toBe(false); // same row
  expect(isPieceAllowed(board, 1, 0, 'square', 'black')).toBe(false); // same col
  expect(isPieceAllowed(board, 1, 1, 'square', 'black')).toBe(false); // same zone
  expect(isPieceAllowed(board, 2, 2, 'square', 'black')).toBe(true); // elsewhere
});

test('clonePlayer', () => {
  const white = new Player('white');
  const cloned = clonePlayer(white);
  expect(white.color).toBe(cloned.color);
  expect(white.pieces.length).toBe(cloned.pieces.length);
  expect(white.pieces.length).toBe(8);
  cloned.pieces = [];
  expect(cloned.pieces.length).toBe(0);
  expect(white.pieces.length).toBe(8);
});

test('cloneBoard', () => {
  const board = [
    [{ piece: 'triangle', color: 'white' }, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ];
  const cloned = cloneBoard(board);
  expect(cloned[0][0].piece).toBe(board[0][0].piece)
  cloned[0][1] = { piece: 'square', color: 'black' };
  expect(cloned[0][1].piece).not.toBe(board[0][1].piece);

  // warning this cloning method clone board and allows to freely add new pieces
  // but if you modify an existing piece, it will modify its reference even on the original board
  // this is not a real problem for us since we just need to add new pieces and not modify existing ones
  // otherwise we would have to complexify this clone function
  cloned[0][0].piece = 'square';
  expect(cloned[0][0].piece).toBe(board[0][0].piece);
});
