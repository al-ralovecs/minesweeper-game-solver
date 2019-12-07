import Board from '../../src/Entities/Board.ts';
import state from './states/3x3.json';

describe('Board', () => {
  test('determine if a cell is boundary', () => {
    const board = new Board(state);

    expect(board.isBoundary(0, 0)).toBe(true);
    expect(board.isBoundary(0, 1)).toBe(false);
    expect(board.isBoundary(0, 2)).toBe(true);
    expect(board.isBoundary(1, 0)).toBe(false);
    expect(board.isBoundary(1, 1)).toBe(true);
    expect(board.isBoundary(1, 2)).toBe(true);
    expect(board.isBoundary(2, 0)).toBe(true);
    expect(board.isBoundary(2, 1)).toBe(true);
    expect(board.isBoundary(2, 2)).toBe(false);
  })
});
