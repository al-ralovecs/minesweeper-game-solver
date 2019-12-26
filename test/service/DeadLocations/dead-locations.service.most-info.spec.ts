import { disposition } from '../../__fixtures__/state/16x16x40.pe.most-info.json';

import DeadLocationsService from '../../../src/minesweeper/service/dead-locations.service';
import getService from './function.get.service';

describe('DeadLocationsService', () => {
    test('test if finds on a disposition', () => {
        expect(getService(disposition, 40).getData).toMatchSnapshot();
    });
});
