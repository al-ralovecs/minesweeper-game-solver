import Board from '../../src/Entities/Board.ts';
import state from './states/3x3.json';

describe('Board', () => {
  test('get cell value', () => {
    const board = new Board(state);

    expect(board.getValue(0, 0)).toBe(-1);
    expect(board.getValue(0, 1)).toBe(1);
    expect(board.getValue(1, 0)).toBe(2);
    expect(board.getValue(2, 1)).toBe(-1);
  })
});
