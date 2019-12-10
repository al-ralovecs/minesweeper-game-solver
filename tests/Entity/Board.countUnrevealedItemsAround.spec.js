import Board from '../../src/Entity/Board.ts';
import state3x3 from '../fixtures/state/3x3.json';
import state9x9 from '../fixtures/state/9x9.json';

describe('Board', () => {
  test('count unrevealed items around, 3x3 board', () => {
    const board = new Board(state3x3);

    expect(board.countUnrevealedItemsAround(0, 0)).toBe(1);
    expect(board.countUnrevealedItemsAround(0, 1)).toBe(4);
    expect(board.countUnrevealedItemsAround(0, 2)).toBe(2);
    expect(board.countUnrevealedItemsAround(1, 0)).toBe(4);
    expect(board.countUnrevealedItemsAround(1, 1)).toBe(6);
    expect(board.countUnrevealedItemsAround(1, 2)).toBe(4);
    expect(board.countUnrevealedItemsAround(2, 0)).toBe(2);
    expect(board.countUnrevealedItemsAround(2, 1)).toBe(4);
    expect(board.countUnrevealedItemsAround(2, 2)).toBe(3);
  });

  test('count unrevealed items around, 9x9 board', () => {
    const board = new Board(state9x9);

    expect(board.countUnrevealedItemsAround(0, 0)).toBe(0);
    expect(board.countUnrevealedItemsAround(0, 1)).toBe(0);
    expect(board.countUnrevealedItemsAround(0, 2)).toBe(2);
    expect(board.countUnrevealedItemsAround(0, 3)).toBe(3);
    expect(board.countUnrevealedItemsAround(0, 4)).toBe(5);
    expect(board.countUnrevealedItemsAround(0, 5)).toBe(5);
    expect(board.countUnrevealedItemsAround(0, 6)).toBe(5);
    expect(board.countUnrevealedItemsAround(0, 7)).toBe(5);
    expect(board.countUnrevealedItemsAround(0, 8)).toBe(3);

    expect(board.countUnrevealedItemsAround(1, 0)).toBe(0);
    expect(board.countUnrevealedItemsAround(1, 1)).toBe(0);
    expect(board.countUnrevealedItemsAround(1, 2)).toBe(2);
    expect(board.countUnrevealedItemsAround(1, 3)).toBe(3);
    expect(board.countUnrevealedItemsAround(1, 4)).toBe(5);
    expect(board.countUnrevealedItemsAround(1, 5)).toBe(5);
    expect(board.countUnrevealedItemsAround(1, 6)).toBe(5);
    expect(board.countUnrevealedItemsAround(1, 7)).toBe(6);
    expect(board.countUnrevealedItemsAround(1, 8)).toBe(4);

    expect(board.countUnrevealedItemsAround(2, 0)).toBe(0);
    expect(board.countUnrevealedItemsAround(2, 1)).toBe(0);
    expect(board.countUnrevealedItemsAround(2, 2)).toBe(1);
    expect(board.countUnrevealedItemsAround(2, 3)).toBe(2);
    expect(board.countUnrevealedItemsAround(2, 4)).toBe(3);
    expect(board.countUnrevealedItemsAround(2, 5)).toBe(3);
    expect(board.countUnrevealedItemsAround(2, 6)).toBe(3);
    expect(board.countUnrevealedItemsAround(2, 7)).toBe(5);
    expect(board.countUnrevealedItemsAround(2, 8)).toBe(3);

    expect(board.countUnrevealedItemsAround(3, 0)).toBe(0);
    expect(board.countUnrevealedItemsAround(3, 1)).toBe(0);
    expect(board.countUnrevealedItemsAround(3, 2)).toBe(0);
    expect(board.countUnrevealedItemsAround(3, 3)).toBe(0);
    expect(board.countUnrevealedItemsAround(3, 4)).toBe(0);
    expect(board.countUnrevealedItemsAround(3, 5)).toBe(0);
    expect(board.countUnrevealedItemsAround(3, 6)).toBe(0);
    expect(board.countUnrevealedItemsAround(3, 7)).toBe(2);
    expect(board.countUnrevealedItemsAround(3, 8)).toBe(1);

    expect(board.countUnrevealedItemsAround(4, 0)).toBe(0);
    expect(board.countUnrevealedItemsAround(4, 1)).toBe(0);
    expect(board.countUnrevealedItemsAround(4, 2)).toBe(0);
    expect(board.countUnrevealedItemsAround(4, 3)).toBe(0);
    expect(board.countUnrevealedItemsAround(4, 4)).toBe(0);
    expect(board.countUnrevealedItemsAround(4, 5)).toBe(0);
    expect(board.countUnrevealedItemsAround(4, 6)).toBe(0);
    expect(board.countUnrevealedItemsAround(4, 7)).toBe(1);
    expect(board.countUnrevealedItemsAround(4, 8)).toBe(1);

    expect(board.countUnrevealedItemsAround(5, 0)).toBe(0);
    expect(board.countUnrevealedItemsAround(5, 1)).toBe(0);
    expect(board.countUnrevealedItemsAround(5, 2)).toBe(0);
    expect(board.countUnrevealedItemsAround(5, 3)).toBe(0);
    expect(board.countUnrevealedItemsAround(5, 4)).toBe(0);
    expect(board.countUnrevealedItemsAround(5, 5)).toBe(0);
    expect(board.countUnrevealedItemsAround(5, 6)).toBe(0);
    expect(board.countUnrevealedItemsAround(5, 7)).toBe(0);
    expect(board.countUnrevealedItemsAround(5, 8)).toBe(0);

    expect(board.countUnrevealedItemsAround(6, 0)).toBe(0);
    expect(board.countUnrevealedItemsAround(6, 1)).toBe(0);
    expect(board.countUnrevealedItemsAround(6, 2)).toBe(0);
    expect(board.countUnrevealedItemsAround(6, 3)).toBe(0);
    expect(board.countUnrevealedItemsAround(6, 4)).toBe(0);
    expect(board.countUnrevealedItemsAround(6, 5)).toBe(1);
    expect(board.countUnrevealedItemsAround(6, 6)).toBe(1);
    expect(board.countUnrevealedItemsAround(6, 7)).toBe(1);
    expect(board.countUnrevealedItemsAround(6, 8)).toBe(0);

    expect(board.countUnrevealedItemsAround(7, 0)).toBe(2);
    expect(board.countUnrevealedItemsAround(7, 1)).toBe(2);
    expect(board.countUnrevealedItemsAround(7, 2)).toBe(1);
    expect(board.countUnrevealedItemsAround(7, 3)).toBe(0);
    expect(board.countUnrevealedItemsAround(7, 4)).toBe(1);
    expect(board.countUnrevealedItemsAround(7, 5)).toBe(3);
    expect(board.countUnrevealedItemsAround(7, 6)).toBe(3);
    expect(board.countUnrevealedItemsAround(7, 7)).toBe(4);
    expect(board.countUnrevealedItemsAround(7, 8)).toBe(2);

    expect(board.countUnrevealedItemsAround(8, 0)).toBe(1);
    expect(board.countUnrevealedItemsAround(8, 1)).toBe(1);
    expect(board.countUnrevealedItemsAround(8, 2)).toBe(1);
    expect(board.countUnrevealedItemsAround(8, 3)).toBe(0);
    expect(board.countUnrevealedItemsAround(8, 4)).toBe(1);
    expect(board.countUnrevealedItemsAround(8, 5)).toBe(2);
    expect(board.countUnrevealedItemsAround(8, 6)).toBe(3);
    expect(board.countUnrevealedItemsAround(8, 7)).toBe(3);
    expect(board.countUnrevealedItemsAround(8, 8)).toBe(1);
  });
});
