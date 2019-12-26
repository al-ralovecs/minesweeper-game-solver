import { disposition } from '../../__fixtures__/state/3x3.single-exposed.json';

import DeadLocationsService from '../../../src/service/dead-locations.service';
import getService from './function.get.service';

describe('DeadLocationsService', () => {
    test('test if finds on a disposition', () => {
        expect(getService(disposition, 4).getData).toMatchSnapshot();
    });
});
