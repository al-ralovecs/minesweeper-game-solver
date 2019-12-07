import Board from '../../src/Entities/Board';

describe('Board', () => {
  test('identification of board dimensions', () => {
    const state = [
      [
        -1, -1, -1,
      ],
      [
        -1, -1, -1,
      ],
      [
        -1, -1, -1,
      ],
    ];

    const board = new Board(state);

    expect(board.height).toBe(3);
    expect(board.width).toBe(3);
  })
});
