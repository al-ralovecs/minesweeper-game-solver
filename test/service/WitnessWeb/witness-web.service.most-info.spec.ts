import { disposition } from '../../__fixtures__/state/16x16x40.pe.most-info.json';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import getService from './function.get.service';

describe('WitnessWebService', () => {
    test('process on filled disposition', () => {
        expect(
            getService(disposition, 40).getWitnessWeb.getPrunedWitnesses
        ).toMatchSnapshot();
    });
});
