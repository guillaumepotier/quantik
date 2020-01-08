import {
  hasWon,
  isPieceAllowed
} from './tools'

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
