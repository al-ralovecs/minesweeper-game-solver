import Board from '../../src/Entity/Board.ts';
import state9x9 from '../fixtures/state/9x9.json';

describe('Board', () => {
  test('analytically infer if there is a mine at a cell', () => {
    const board = new Board(state9x9);

    expect(board.isMine(0, 0)).toBe(false);
    expect(board.isMine(0, 1)).toBe(false);
    expect(board.isMine(0, 2)).toBe(false);
    expect(board.isMine(0, 3)).toBe(true);
    expect(board.isMine(0, 4)).toBe(false);
    expect(board.isMine(0, 5)).toBe(false);
    expect(board.isMine(0, 6)).toBe(false);
    expect(board.isMine(0, 7)).toBe(false);
    expect(board.isMine(0, 8)).toBe(false);

    expect(board.isMine(1, 0)).toBe(false);
    expect(board.isMine(1, 1)).toBe(false);
    expect(board.isMine(1, 2)).toBe(false);
    expect(board.isMine(1, 3)).toBe(true);
    expect(board.isMine(1, 4)).toBe(false);
    expect(board.isMine(1, 5)).toBe(false);
    expect(board.isMine(1, 6)).toBe(false);
    expect(board.isMine(1, 7)).toBe(false);
    expect(board.isMine(1, 8)).toBe(false);

    expect(board.isMine(2, 0)).toBe(false);
    expect(board.isMine(2, 1)).toBe(false);
    expect(board.isMine(2, 2)).toBe(false);
    expect(board.isMine(2, 3)).toBe(false);
    expect(board.isMine(2, 4)).toBe(false);
    expect(board.isMine(2, 5)).toBe(false);
    expect(board.isMine(2, 6)).toBe(false);
    expect(board.isMine(2, 7)).toBe(false);
    expect(board.isMine(2, 8)).toBe(false);

    expect(board.isMine(3, 0)).toBe(false);
    expect(board.isMine(3, 1)).toBe(false);
    expect(board.isMine(3, 2)).toBe(false);
    expect(board.isMine(3, 3)).toBe(false);
    expect(board.isMine(3, 4)).toBe(false);
    expect(board.isMine(3, 5)).toBe(false);
    expect(board.isMine(3, 6)).toBe(false);
    expect(board.isMine(3, 7)).toBe(false);
    expect(board.isMine(3, 8)).toBe(true);

    expect(board.isMine(4, 0)).toBe(false);
    expect(board.isMine(4, 1)).toBe(false);
    expect(board.isMine(4, 2)).toBe(false);
    expect(board.isMine(4, 3)).toBe(false);
    expect(board.isMine(4, 4)).toBe(false);
    expect(board.isMine(4, 5)).toBe(false);
    expect(board.isMine(4, 6)).toBe(false);
    expect(board.isMine(4, 7)).toBe(false);
    expect(board.isMine(4, 8)).toBe(false);

    expect(board.isMine(5, 0)).toBe(false);
    expect(board.isMine(5, 1)).toBe(false);
    expect(board.isMine(5, 2)).toBe(false);
    expect(board.isMine(5, 3)).toBe(false);
    expect(board.isMine(5, 4)).toBe(false);
    expect(board.isMine(5, 5)).toBe(false);
    expect(board.isMine(5, 6)).toBe(false);
    expect(board.isMine(5, 7)).toBe(false);
    expect(board.isMine(5, 8)).toBe(false);

    expect(board.isMine(6, 0)).toBe(false);
    expect(board.isMine(6, 1)).toBe(false);
    expect(board.isMine(6, 2)).toBe(false);
    expect(board.isMine(6, 3)).toBe(false);
    expect(board.isMine(6, 4)).toBe(false);
    expect(board.isMine(6, 5)).toBe(false);
    expect(board.isMine(6, 6)).toBe(false);
    expect(board.isMine(6, 7)).toBe(false);
    expect(board.isMine(6, 8)).toBe(false);

    expect(board.isMine(7, 0)).toBe(false);
    expect(board.isMine(7, 1)).toBe(false);
    expect(board.isMine(7, 2)).toBe(false);
    expect(board.isMine(7, 3)).toBe(false);
    expect(board.isMine(7, 4)).toBe(false);
    expect(board.isMine(7, 5)).toBe(false);
    expect(board.isMine(7, 6)).toBe(true);
    expect(board.isMine(7, 7)).toBe(false);
    expect(board.isMine(7, 8)).toBe(false);

    expect(board.isMine(8, 0)).toBe(false);
    expect(board.isMine(8, 1)).toBe(true);
    expect(board.isMine(8, 2)).toBe(false);
    expect(board.isMine(8, 3)).toBe(false);
    expect(board.isMine(8, 4)).toBe(false);
    expect(board.isMine(8, 5)).toBe(true);
    expect(board.isMine(8, 6)).toBe(false);
    expect(board.isMine(8, 7)).toBe(false);
    expect(board.isMine(8, 8)).toBe(false);
  })
});
