import { disposition } from '../../__fixtures__/state/16x16x40.pe.best-probability.json';
import BoardStateService from '../../../src/service/board-state.service';
import getService from './function.get.service';

describe('BoardStateService', () => {
    test('check how computes empty board', () => {
        expect(getService(disposition, 40).getBoardState).toMatchSnapshot();
    });
});
