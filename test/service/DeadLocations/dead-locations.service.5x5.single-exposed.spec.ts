import { disposition } from '../../__fixtures__/state/5x5.single-exposed.json';

import DeadLocationsService from '../../../src/service/dead-locations.service';
import getService from './function.get.service';

describe('DeadLocationsService', () => {
    test('test if finds on a disposition', () => {
        expect(getService(disposition, 7).getData).toMatchSnapshot();
    });
});
