import { disposition } from '../../__fixtures__/state/3x3.filled.json';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import getService from './function.get.service';

describe('WitnessWebService', () => {
    test('process on filled disposition', () => {
        expect(
            getService(disposition, 2, 3).getWitnessWeb.getPrunedWitnesses
        ).toMatchSnapshot();
    });
});
