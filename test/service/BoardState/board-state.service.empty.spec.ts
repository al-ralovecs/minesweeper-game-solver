import { disposition } from '../../__fixtures__/state/3x3.empty.json';
import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import getService from './function.get.service';

describe('BoardStateService', () => {
    test('check how computes empty board', () => {
        expect(getService(disposition, 4).getBoardState).toMatchSnapshot();
    });
});
