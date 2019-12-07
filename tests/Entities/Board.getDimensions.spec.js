import Board from '../../src/Entities/Board.ts';
import state from './states/3x3.json';

describe('Board', () => {
  test('identification of board dimensions', () => {
    const board = new Board(state);

    expect(board.getHeight).toBe(3);
    expect(board.getWidth).toBe(3);
  })
});
