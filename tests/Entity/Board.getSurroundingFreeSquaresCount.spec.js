import Board from '../../src/Entity/Board.ts';
import state3x3 from '../fixtures/state/3x3.json';
import state9x9 from '../fixtures/state/9x9.json';

describe('Board', () => {
  test('count free squares around, 3x3 board', () => {
    const board = new Board(state3x3);

    expect(board.getSurroundingFreeSquaresCount(0, 0)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(0, 1)).toBe(4);
    expect(board.getSurroundingFreeSquaresCount(0, 2)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(1, 0)).toBe(4);
    expect(board.getSurroundingFreeSquaresCount(1, 1)).toBe(6);
    expect(board.getSurroundingFreeSquaresCount(1, 2)).toBe(4);
    expect(board.getSurroundingFreeSquaresCount(2, 0)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(2, 1)).toBe(4);
    expect(board.getSurroundingFreeSquaresCount(2, 2)).toBe(3);
  });

  test('count free squares around,  9x9 board', () => {
    const board = new Board(state9x9);

    expect(board.getSurroundingFreeSquaresCount(0, 0)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(0, 1)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(0, 2)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(0, 3)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(0, 4)).toBe(5);
    expect(board.getSurroundingFreeSquaresCount(0, 5)).toBe(5);
    expect(board.getSurroundingFreeSquaresCount(0, 6)).toBe(5);
    expect(board.getSurroundingFreeSquaresCount(0, 7)).toBe(5);
    expect(board.getSurroundingFreeSquaresCount(0, 8)).toBe(3);

    expect(board.getSurroundingFreeSquaresCount(1, 0)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(1, 1)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(1, 2)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(1, 3)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(1, 4)).toBe(5);
    expect(board.getSurroundingFreeSquaresCount(1, 5)).toBe(5);
    expect(board.getSurroundingFreeSquaresCount(1, 6)).toBe(5);
    expect(board.getSurroundingFreeSquaresCount(1, 7)).toBe(6);
    expect(board.getSurroundingFreeSquaresCount(1, 8)).toBe(4);

    expect(board.getSurroundingFreeSquaresCount(2, 0)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(2, 1)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(2, 2)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(2, 3)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(2, 4)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(2, 5)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(2, 6)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(2, 7)).toBe(5);
    expect(board.getSurroundingFreeSquaresCount(2, 8)).toBe(3);

    expect(board.getSurroundingFreeSquaresCount(3, 0)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(3, 1)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(3, 2)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(3, 3)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(3, 4)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(3, 5)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(3, 6)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(3, 7)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(3, 8)).toBe(1);

    expect(board.getSurroundingFreeSquaresCount(4, 0)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(4, 1)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(4, 2)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(4, 3)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(4, 4)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(4, 5)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(4, 6)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(4, 7)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(4, 8)).toBe(1);

    expect(board.getSurroundingFreeSquaresCount(5, 0)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(5, 1)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(5, 2)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(5, 3)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(5, 4)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(5, 5)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(5, 6)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(5, 7)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(5, 8)).toBe(0);

    expect(board.getSurroundingFreeSquaresCount(6, 0)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(6, 1)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(6, 2)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(6, 3)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(6, 4)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(6, 5)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(6, 6)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(6, 7)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(6, 8)).toBe(0);

    expect(board.getSurroundingFreeSquaresCount(7, 0)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(7, 1)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(7, 2)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(7, 3)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(7, 4)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(7, 5)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(7, 6)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(7, 7)).toBe(4);
    expect(board.getSurroundingFreeSquaresCount(7, 8)).toBe(2);

    expect(board.getSurroundingFreeSquaresCount(8, 0)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(8, 1)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(8, 2)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(8, 3)).toBe(0);
    expect(board.getSurroundingFreeSquaresCount(8, 4)).toBe(1);
    expect(board.getSurroundingFreeSquaresCount(8, 5)).toBe(2);
    expect(board.getSurroundingFreeSquaresCount(8, 6)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(8, 7)).toBe(3);
    expect(board.getSurroundingFreeSquaresCount(8, 8)).toBe(1);
  });
});
