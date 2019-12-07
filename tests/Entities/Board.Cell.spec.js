import Board from '../../src/Entities/Board';

describe('Board', () => {
  test('get cell value', () => {
    const state = [
      [
        -1, 1, -1,
      ],
      [
        -1, 2, -1,
      ],
      [
        -1, 3, -1,
      ],
    ];

    const board = new Board(state);

    expect(board.getCell(0, 0)).toBe(-1);
    expect(board.getCell(0, 1)).toBe(1);
    expect(board.getCell(1, 1)).toBe(2);
    expect(board.getCell(2, 1)).toBe(3);
  })
});
