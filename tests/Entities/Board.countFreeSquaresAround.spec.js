import Board from '../../src/Entities/Board';

describe('Board', () => {
  test('count free squares around', () => {
    const state = [
      [
        -1, 1, -1,
      ],
      [
        2, -1, -1,
      ],
      [
        -1, -1, -1,
      ],
    ];

    const board = new Board(state);

    expect(board.countFreeSquaresAround(0, 0)).toBe(1);
    expect(board.countFreeSquaresAround(0, 1)).toBe(4);
    expect(board.countFreeSquaresAround(0, 2)).toBe(2);
    expect(board.countFreeSquaresAround(1, 0)).toBe(4);
    expect(board.countFreeSquaresAround(1, 1)).toBe(6);
    expect(board.countFreeSquaresAround(1, 2)).toBe(4);
    expect(board.countFreeSquaresAround(2, 0)).toBe(2);
    expect(board.countFreeSquaresAround(2, 1)).toBe(4);
    expect(board.countFreeSquaresAround(2, 2)).toBe(3);
  });

  test('count free squares around 2', () => {
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

    expect(board.countFreeSquaresAround(0, 0)).toBe(0);
    expect(board.countFreeSquaresAround(0, 1)).toBe(0);
    expect(board.countFreeSquaresAround(0, 2)).toBe(2);
    expect(board.countFreeSquaresAround(0, 3)).toBe(3);
    expect(board.countFreeSquaresAround(0, 4)).toBe(5);
    expect(board.countFreeSquaresAround(0, 5)).toBe(5);
    expect(board.countFreeSquaresAround(0, 6)).toBe(5);
    expect(board.countFreeSquaresAround(0, 7)).toBe(5);
    expect(board.countFreeSquaresAround(0, 8)).toBe(3);

    expect(board.countFreeSquaresAround(1, 0)).toBe(0);
    expect(board.countFreeSquaresAround(1, 1)).toBe(0);
    expect(board.countFreeSquaresAround(1, 2)).toBe(2);
    expect(board.countFreeSquaresAround(1, 3)).toBe(3);
    expect(board.countFreeSquaresAround(1, 4)).toBe(5);
    expect(board.countFreeSquaresAround(1, 5)).toBe(5);
    expect(board.countFreeSquaresAround(1, 6)).toBe(5);
    expect(board.countFreeSquaresAround(1, 7)).toBe(6);
    expect(board.countFreeSquaresAround(1, 8)).toBe(4);

    expect(board.countFreeSquaresAround(2, 0)).toBe(0);
    expect(board.countFreeSquaresAround(2, 1)).toBe(0);
    expect(board.countFreeSquaresAround(2, 2)).toBe(1);
    expect(board.countFreeSquaresAround(2, 3)).toBe(2);
    expect(board.countFreeSquaresAround(2, 4)).toBe(3);
    expect(board.countFreeSquaresAround(2, 5)).toBe(3);
    expect(board.countFreeSquaresAround(2, 6)).toBe(3);
    expect(board.countFreeSquaresAround(2, 7)).toBe(5);
    expect(board.countFreeSquaresAround(2, 8)).toBe(3);

    expect(board.countFreeSquaresAround(3, 0)).toBe(0);
    expect(board.countFreeSquaresAround(3, 1)).toBe(0);
    expect(board.countFreeSquaresAround(3, 2)).toBe(0);
    expect(board.countFreeSquaresAround(3, 3)).toBe(0);
    expect(board.countFreeSquaresAround(3, 4)).toBe(0);
    expect(board.countFreeSquaresAround(3, 5)).toBe(0);
    expect(board.countFreeSquaresAround(3, 6)).toBe(0);
    expect(board.countFreeSquaresAround(3, 7)).toBe(2);
    expect(board.countFreeSquaresAround(3, 8)).toBe(1);

    expect(board.countFreeSquaresAround(4, 0)).toBe(0);
    expect(board.countFreeSquaresAround(4, 1)).toBe(0);
    expect(board.countFreeSquaresAround(4, 2)).toBe(0);
    expect(board.countFreeSquaresAround(4, 3)).toBe(0);
    expect(board.countFreeSquaresAround(4, 4)).toBe(0);
    expect(board.countFreeSquaresAround(4, 5)).toBe(0);
    expect(board.countFreeSquaresAround(4, 6)).toBe(0);
    expect(board.countFreeSquaresAround(4, 7)).toBe(1);
    expect(board.countFreeSquaresAround(4, 8)).toBe(1);

    expect(board.countFreeSquaresAround(5, 0)).toBe(0);
    expect(board.countFreeSquaresAround(5, 1)).toBe(0);
    expect(board.countFreeSquaresAround(5, 2)).toBe(0);
    expect(board.countFreeSquaresAround(5, 3)).toBe(0);
    expect(board.countFreeSquaresAround(5, 4)).toBe(0);
    expect(board.countFreeSquaresAround(5, 5)).toBe(0);
    expect(board.countFreeSquaresAround(5, 6)).toBe(0);
    expect(board.countFreeSquaresAround(5, 7)).toBe(0);
    expect(board.countFreeSquaresAround(5, 8)).toBe(0);

    expect(board.countFreeSquaresAround(6, 0)).toBe(0);
    expect(board.countFreeSquaresAround(6, 1)).toBe(0);
    expect(board.countFreeSquaresAround(6, 2)).toBe(0);
    expect(board.countFreeSquaresAround(6, 3)).toBe(0);
    expect(board.countFreeSquaresAround(6, 4)).toBe(0);
    expect(board.countFreeSquaresAround(6, 5)).toBe(1);
    expect(board.countFreeSquaresAround(6, 6)).toBe(1);
    expect(board.countFreeSquaresAround(6, 7)).toBe(1);
    expect(board.countFreeSquaresAround(6, 8)).toBe(0);

    expect(board.countFreeSquaresAround(7, 0)).toBe(2);
    expect(board.countFreeSquaresAround(7, 1)).toBe(2);
    expect(board.countFreeSquaresAround(7, 2)).toBe(1);
    expect(board.countFreeSquaresAround(7, 3)).toBe(0);
    expect(board.countFreeSquaresAround(7, 4)).toBe(1);
    expect(board.countFreeSquaresAround(7, 5)).toBe(3);
    expect(board.countFreeSquaresAround(7, 6)).toBe(3);
    expect(board.countFreeSquaresAround(7, 7)).toBe(4);
    expect(board.countFreeSquaresAround(7, 8)).toBe(2);

    expect(board.countFreeSquaresAround(8, 0)).toBe(1);
    expect(board.countFreeSquaresAround(8, 1)).toBe(1);
    expect(board.countFreeSquaresAround(8, 2)).toBe(1);
    expect(board.countFreeSquaresAround(8, 3)).toBe(0);
    expect(board.countFreeSquaresAround(8, 4)).toBe(1);
    expect(board.countFreeSquaresAround(8, 5)).toBe(2);
    expect(board.countFreeSquaresAround(8, 6)).toBe(3);
    expect(board.countFreeSquaresAround(8, 7)).toBe(3);
    expect(board.countFreeSquaresAround(8, 8)).toBe(1);
  });
});
