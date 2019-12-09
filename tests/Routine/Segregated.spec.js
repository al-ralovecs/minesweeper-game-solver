import Board from '../../src/Entity/Board.ts';
import Regions from '../../src/Strategy/Regions';
import state from '../fixtures/state/11x16.json';

describe('Segregated', () => {
    test('check if segregates', () => {
        const board = new Board(state);
        const segregated = new Regions(board);
        segregated.segregate();

        expect(segregated.count).toBe(2);
        expect(segregated.list).toMatchSnapshot();
    })
});
