import Board from '../../src/Entity/Board.ts';
import state from '../fixtures/state/3x3.json';

describe('Board', () => {
  test('determine if a cell is a boundary one', () => {
    const board = new Board(state);

    expect(board.getIsBoundary(0, 0)).toBe(true);
    expect(board.getIsBoundary(0, 1)).toBe(false);
    expect(board.getIsBoundary(0, 2)).toBe(true);
    expect(board.getIsBoundary(1, 0)).toBe(false);
    expect(board.getIsBoundary(1, 1)).toBe(true);
    expect(board.getIsBoundary(1, 2)).toBe(true);
    expect(board.getIsBoundary(2, 0)).toBe(true);
    expect(board.getIsBoundary(2, 1)).toBe(true);
    expect(board.getIsBoundary(2, 2)).toBe(false);
  })
});
