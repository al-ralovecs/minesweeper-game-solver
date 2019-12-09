import Board from '../../src/Entity/Board.ts';
import state9x9 from '../fixtures/state/9x9.json';

describe('Board', () => {
  test('analytically infer if there is a mine at a cell', () => {
    const board = new Board(state9x9);

    expect(board.getIsMine(0, 0)).toBe(false);
    expect(board.getIsMine(0, 1)).toBe(false);
    expect(board.getIsMine(0, 2)).toBe(false);
    expect(board.getIsMine(0, 3)).toBe(true);
    expect(board.getIsMine(0, 4)).toBe(false);
    expect(board.getIsMine(0, 5)).toBe(false);
    expect(board.getIsMine(0, 6)).toBe(false);
    expect(board.getIsMine(0, 7)).toBe(false);
    expect(board.getIsMine(0, 8)).toBe(false);

    expect(board.getIsMine(1, 0)).toBe(false);
    expect(board.getIsMine(1, 1)).toBe(false);
    expect(board.getIsMine(1, 2)).toBe(false);
    expect(board.getIsMine(1, 3)).toBe(true);
    expect(board.getIsMine(1, 4)).toBe(false);
    expect(board.getIsMine(1, 5)).toBe(false);
    expect(board.getIsMine(1, 6)).toBe(false);
    expect(board.getIsMine(1, 7)).toBe(false);
    expect(board.getIsMine(1, 8)).toBe(false);

    expect(board.getIsMine(2, 0)).toBe(false);
    expect(board.getIsMine(2, 1)).toBe(false);
    expect(board.getIsMine(2, 2)).toBe(false);
    expect(board.getIsMine(2, 3)).toBe(false);
    expect(board.getIsMine(2, 4)).toBe(false);
    expect(board.getIsMine(2, 5)).toBe(false);
    expect(board.getIsMine(2, 6)).toBe(false);
    expect(board.getIsMine(2, 7)).toBe(false);
    expect(board.getIsMine(2, 8)).toBe(false);

    expect(board.getIsMine(3, 0)).toBe(false);
    expect(board.getIsMine(3, 1)).toBe(false);
    expect(board.getIsMine(3, 2)).toBe(false);
    expect(board.getIsMine(3, 3)).toBe(false);
    expect(board.getIsMine(3, 4)).toBe(false);
    expect(board.getIsMine(3, 5)).toBe(false);
    expect(board.getIsMine(3, 6)).toBe(false);
    expect(board.getIsMine(3, 7)).toBe(false);
    expect(board.getIsMine(3, 8)).toBe(true);

    expect(board.getIsMine(4, 0)).toBe(false);
    expect(board.getIsMine(4, 1)).toBe(false);
    expect(board.getIsMine(4, 2)).toBe(false);
    expect(board.getIsMine(4, 3)).toBe(false);
    expect(board.getIsMine(4, 4)).toBe(false);
    expect(board.getIsMine(4, 5)).toBe(false);
    expect(board.getIsMine(4, 6)).toBe(false);
    expect(board.getIsMine(4, 7)).toBe(false);
    expect(board.getIsMine(4, 8)).toBe(false);

    expect(board.getIsMine(5, 0)).toBe(false);
    expect(board.getIsMine(5, 1)).toBe(false);
    expect(board.getIsMine(5, 2)).toBe(false);
    expect(board.getIsMine(5, 3)).toBe(false);
    expect(board.getIsMine(5, 4)).toBe(false);
    expect(board.getIsMine(5, 5)).toBe(false);
    expect(board.getIsMine(5, 6)).toBe(false);
    expect(board.getIsMine(5, 7)).toBe(false);
    expect(board.getIsMine(5, 8)).toBe(false);

    expect(board.getIsMine(6, 0)).toBe(false);
    expect(board.getIsMine(6, 1)).toBe(false);
    expect(board.getIsMine(6, 2)).toBe(false);
    expect(board.getIsMine(6, 3)).toBe(false);
    expect(board.getIsMine(6, 4)).toBe(false);
    expect(board.getIsMine(6, 5)).toBe(false);
    expect(board.getIsMine(6, 6)).toBe(false);
    expect(board.getIsMine(6, 7)).toBe(false);
    expect(board.getIsMine(6, 8)).toBe(false);

    expect(board.getIsMine(7, 0)).toBe(false);
    expect(board.getIsMine(7, 1)).toBe(false);
    expect(board.getIsMine(7, 2)).toBe(false);
    expect(board.getIsMine(7, 3)).toBe(false);
    expect(board.getIsMine(7, 4)).toBe(false);
    expect(board.getIsMine(7, 5)).toBe(false);
    expect(board.getIsMine(7, 6)).toBe(true);
    expect(board.getIsMine(7, 7)).toBe(false);
    expect(board.getIsMine(7, 8)).toBe(false);

    expect(board.getIsMine(8, 0)).toBe(false);
    expect(board.getIsMine(8, 1)).toBe(true);
    expect(board.getIsMine(8, 2)).toBe(false);
    expect(board.getIsMine(8, 3)).toBe(false);
    expect(board.getIsMine(8, 4)).toBe(false);
    expect(board.getIsMine(8, 5)).toBe(true);
    expect(board.getIsMine(8, 6)).toBe(false);
    expect(board.getIsMine(8, 7)).toBe(false);
    expect(board.getIsMine(8, 8)).toBe(false);
  })
});
