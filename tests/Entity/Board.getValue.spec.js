import Board from '../../src/Entity/Board.ts';
import state from '../fixtures/state/3x3.json.js';

describe('Board', () => {
  test('item cell value', () => {
    const board = new Board(state);

    expect(board.getValue(0, 0)).toBe(-1);
    expect(board.getValue(0, 1)).toBe(1);
    expect(board.getValue(1, 0)).toBe(2);
    expect(board.getValue(2, 1)).toBe(-1);
  })
});
