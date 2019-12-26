import { disposition } from '../../__fixtures__/state/3x3.filled.json';
import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import getService from './function.get.service';

describe('BoardStateService', () => {
    test('check how computes filled board', () => {
        expect(getService(disposition, 3, 3, 0).getBoardState).toMatchSnapshot();
    })
});
