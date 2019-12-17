import Board from '../../src/Entity/Board.ts';
import state9x9 from '../fixtures/state/9x9.json.js';

describe('Board', () => {
  test('analytically infer if there is a mine at a cell', () => {
    const board = new Board(state9x9);

    expect(board.getMinesMap.getIsFlag(0, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(0, 1)).toBe(false);
    expect(board.getMinesMap.getIsFlag(0, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(0, 3)).toBe(true);
    expect(board.getMinesMap.getIsFlag(0, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(0, 5)).toBe(false);
    expect(board.getMinesMap.getIsFlag(0, 6)).toBe(false);
    expect(board.getMinesMap.getIsFlag(0, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(0, 8)).toBe(false);

    expect(board.getMinesMap.getIsFlag(1, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(1, 1)).toBe(false);
    expect(board.getMinesMap.getIsFlag(1, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(1, 3)).toBe(true);
    expect(board.getMinesMap.getIsFlag(1, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(1, 5)).toBe(false);
    expect(board.getMinesMap.getIsFlag(1, 6)).toBe(false);
    expect(board.getMinesMap.getIsFlag(1, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(1, 8)).toBe(false);

    expect(board.getMinesMap.getIsFlag(2, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(2, 1)).toBe(false);
    expect(board.getMinesMap.getIsFlag(2, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(2, 3)).toBe(false);
    expect(board.getMinesMap.getIsFlag(2, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(2, 5)).toBe(false);
    expect(board.getMinesMap.getIsFlag(2, 6)).toBe(false);
    expect(board.getMinesMap.getIsFlag(2, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(2, 8)).toBe(false);

    expect(board.getMinesMap.getIsFlag(3, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(3, 1)).toBe(false);
    expect(board.getMinesMap.getIsFlag(3, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(3, 3)).toBe(false);
    expect(board.getMinesMap.getIsFlag(3, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(3, 5)).toBe(false);
    expect(board.getMinesMap.getIsFlag(3, 6)).toBe(false);
    expect(board.getMinesMap.getIsFlag(3, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(3, 8)).toBe(true);

    expect(board.getMinesMap.getIsFlag(4, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(4, 1)).toBe(false);
    expect(board.getMinesMap.getIsFlag(4, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(4, 3)).toBe(false);
    expect(board.getMinesMap.getIsFlag(4, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(4, 5)).toBe(false);
    expect(board.getMinesMap.getIsFlag(4, 6)).toBe(false);
    expect(board.getMinesMap.getIsFlag(4, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(4, 8)).toBe(false);

    expect(board.getMinesMap.getIsFlag(5, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(5, 1)).toBe(false);
    expect(board.getMinesMap.getIsFlag(5, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(5, 3)).toBe(false);
    expect(board.getMinesMap.getIsFlag(5, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(5, 5)).toBe(false);
    expect(board.getMinesMap.getIsFlag(5, 6)).toBe(false);
    expect(board.getMinesMap.getIsFlag(5, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(5, 8)).toBe(false);

    expect(board.getMinesMap.getIsFlag(6, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(6, 1)).toBe(false);
    expect(board.getMinesMap.getIsFlag(6, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(6, 3)).toBe(false);
    expect(board.getMinesMap.getIsFlag(6, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(6, 5)).toBe(false);
    expect(board.getMinesMap.getIsFlag(6, 6)).toBe(false);
    expect(board.getMinesMap.getIsFlag(6, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(6, 8)).toBe(false);

    expect(board.getMinesMap.getIsFlag(7, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(7, 1)).toBe(false);
    expect(board.getMinesMap.getIsFlag(7, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(7, 3)).toBe(false);
    expect(board.getMinesMap.getIsFlag(7, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(7, 5)).toBe(false);
    expect(board.getMinesMap.getIsFlag(7, 6)).toBe(true);
    expect(board.getMinesMap.getIsFlag(7, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(7, 8)).toBe(false);

    expect(board.getMinesMap.getIsFlag(8, 0)).toBe(false);
    expect(board.getMinesMap.getIsFlag(8, 1)).toBe(true);
    expect(board.getMinesMap.getIsFlag(8, 2)).toBe(false);
    expect(board.getMinesMap.getIsFlag(8, 3)).toBe(false);
    expect(board.getMinesMap.getIsFlag(8, 4)).toBe(false);
    expect(board.getMinesMap.getIsFlag(8, 5)).toBe(true);
    expect(board.getMinesMap.getIsFlag(8, 6)).toBe(false);
    expect(board.getMinesMap.getIsFlag(8, 7)).toBe(false);
    expect(board.getMinesMap.getIsFlag(8, 8)).toBe(false);
  })
});
