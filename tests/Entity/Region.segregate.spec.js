import Board from '../../src/Entity/Board';
import Region from '../../src/Entity/Region';
import state from '../fixtures/state/11x16.json';

describe('Region', () => {
    test('check if segregates', () => {
        const board = new Board(state);
        const regions = new Region();
        regions.segregate(board);

        expect(regions.count).toBe(2);
        expect(regions.getData).toMatchSnapshot();
    })
});
