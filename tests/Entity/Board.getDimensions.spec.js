import Board from '../../src/Entity/Board.ts';
import state from '../fixtures/state/3x3.json.js';

describe('Board', () => {
  test('identification of board dimensions', () => {
    const board = new Board(state);

    expect(board.height).toBe(3);
    expect(board.width).toBe(3);
  })
});
