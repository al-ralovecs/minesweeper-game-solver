import { disposition } from '../../__fixtures__/state/3x3.with-a-mine.json';
import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import getService from './function.get.service';

describe('BoardStateService', () => {
    test('check how computes board with a mine', () => {
        expect(getService(disposition, 1, 1, 0).getBoardState).toMatchSnapshot();
    });
});
