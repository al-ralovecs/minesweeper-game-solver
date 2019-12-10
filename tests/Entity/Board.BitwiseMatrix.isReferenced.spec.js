import Board from '../../src/Entity/Board.ts';
import state from '../fixtures/state/3x3.json';

describe('Board', () => {
  test('test javascript feature: mutate referenced object', () => {
    const board = new Board(state);

    expect(board.getMinesMap.count).toBe(0);

    board.getMinesMap.setIsFlag(0, 2);

    expect(board.getMinesMap.count).toBe(1);
  })
});
