import Board from '../../src/Entities/Board';

describe('Board', () => {
  test('analitically infer if there is a mine at cell', () => {
    const state = [
      [  0,  0, 2, -1, -1, -1, -1, -1, -1 ],
      [  0,  0, 2, -1, -1, -1, -1, -1, -1 ],
      [  0,  0, 1,  1,  2,  1,  1,  1, -1 ],
      [  0,  0, 0,  0,  0,  0,  0,  1, -1 ],
      [  0,  0, 0,  0,  0,  0,  0,  1,  1 ],
      [  0,  0, 0,  0,  0,  0,  0,  0,  0 ],
      [  0,  0, 0,  0,  0,  1,  1,  1,  0 ],
      [  1,  1, 1,  0,  1,  2, -1,  2,  1 ],
      [ -1, -1, 1,  0,  1, -1, -1, -1, -1 ],
    ];

    const board = new Board(state);

    expect(board.hasMine(0, 0)).toBe(false);
    expect(board.hasMine(0, 1)).toBe(false);
    expect(board.hasMine(0, 2)).toBe(false);
    expect(board.hasMine(0, 3)).toBe(true);
    expect(board.hasMine(0, 4)).toBe(false);
    expect(board.hasMine(0, 5)).toBe(false);
    expect(board.hasMine(0, 6)).toBe(false);
    expect(board.hasMine(0, 7)).toBe(false);
    expect(board.hasMine(0, 8)).toBe(false);

    expect(board.hasMine(1, 0)).toBe(false);
    expect(board.hasMine(1, 1)).toBe(false);
    expect(board.hasMine(1, 2)).toBe(false);
    expect(board.hasMine(1, 3)).toBe(true);
    expect(board.hasMine(1, 4)).toBe(false);
    expect(board.hasMine(1, 5)).toBe(false);
    expect(board.hasMine(1, 6)).toBe(false);
    expect(board.hasMine(1, 7)).toBe(false);
    expect(board.hasMine(1, 8)).toBe(false);

    expect(board.hasMine(2, 0)).toBe(false);
    expect(board.hasMine(2, 1)).toBe(false);
    expect(board.hasMine(2, 2)).toBe(false);
    expect(board.hasMine(2, 3)).toBe(false);
    expect(board.hasMine(2, 4)).toBe(false);
    expect(board.hasMine(2, 5)).toBe(false);
    expect(board.hasMine(2, 6)).toBe(false);
    expect(board.hasMine(2, 7)).toBe(false);
    expect(board.hasMine(2, 8)).toBe(false);

    expect(board.hasMine(3, 0)).toBe(false);
    expect(board.hasMine(3, 1)).toBe(false);
    expect(board.hasMine(3, 2)).toBe(false);
    expect(board.hasMine(3, 3)).toBe(false);
    expect(board.hasMine(3, 4)).toBe(false);
    expect(board.hasMine(3, 5)).toBe(false);
    expect(board.hasMine(3, 6)).toBe(false);
    expect(board.hasMine(3, 7)).toBe(false);
    expect(board.hasMine(3, 8)).toBe(true);

    expect(board.hasMine(4, 0)).toBe(false);
    expect(board.hasMine(4, 1)).toBe(false);
    expect(board.hasMine(4, 2)).toBe(false);
    expect(board.hasMine(4, 3)).toBe(false);
    expect(board.hasMine(4, 4)).toBe(false);
    expect(board.hasMine(4, 5)).toBe(false);
    expect(board.hasMine(4, 6)).toBe(false);
    expect(board.hasMine(4, 7)).toBe(false);
    expect(board.hasMine(4, 8)).toBe(false);

    expect(board.hasMine(5, 0)).toBe(false);
    expect(board.hasMine(5, 1)).toBe(false);
    expect(board.hasMine(5, 2)).toBe(false);
    expect(board.hasMine(5, 3)).toBe(false);
    expect(board.hasMine(5, 4)).toBe(false);
    expect(board.hasMine(5, 5)).toBe(false);
    expect(board.hasMine(5, 6)).toBe(false);
    expect(board.hasMine(5, 7)).toBe(false);
    expect(board.hasMine(5, 8)).toBe(false);

    expect(board.hasMine(6, 0)).toBe(false);
    expect(board.hasMine(6, 1)).toBe(false);
    expect(board.hasMine(6, 2)).toBe(false);
    expect(board.hasMine(6, 3)).toBe(false);
    expect(board.hasMine(6, 4)).toBe(false);
    expect(board.hasMine(6, 5)).toBe(false);
    expect(board.hasMine(6, 6)).toBe(false);
    expect(board.hasMine(6, 7)).toBe(false);
    expect(board.hasMine(6, 8)).toBe(false);

    expect(board.hasMine(7, 0)).toBe(false);
    expect(board.hasMine(7, 1)).toBe(false);
    expect(board.hasMine(7, 2)).toBe(false);
    expect(board.hasMine(7, 3)).toBe(false);
    expect(board.hasMine(7, 4)).toBe(false);
    expect(board.hasMine(7, 5)).toBe(false);
    expect(board.hasMine(7, 6)).toBe(true);
    expect(board.hasMine(7, 7)).toBe(false);
    expect(board.hasMine(7, 8)).toBe(false);

    expect(board.hasMine(8, 0)).toBe(false);
    expect(board.hasMine(8, 1)).toBe(true);
    expect(board.hasMine(8, 2)).toBe(false);
    expect(board.hasMine(8, 3)).toBe(false);
    expect(board.hasMine(8, 4)).toBe(false);
    expect(board.hasMine(8, 5)).toBe(true);
    expect(board.hasMine(8, 6)).toBe(false);
    expect(board.hasMine(8, 7)).toBe(false);
    expect(board.hasMine(8, 8)).toBe(false);
  })
});
