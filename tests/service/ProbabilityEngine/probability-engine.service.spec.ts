import { disposition as d1 } from '../../__fixtures__/state/16x16x40.pe.best-probability.json';
import { disposition as d2} from '../../__fixtures__/state/16x16x40.pe.most-info.json';

import Binomial from '../../../src/utility/binomial';
import WitnessWebService from '../../../src/service/witness-web.service';
import DeadLocationsService from '../../../src/service/dead-locations.service';
import ProbabilityEngineService from '../../../src/service/probability-engine.service';

import { ActionType } from '../../../src/dto/action.dto';

import getBoardStateService from '../composite/function.get-board-state.service';
import getWitnessWebService from '../composite/function.get-witness-web.service';
import applyTrivialSearchStrategy from '../composite/function.apply-trivial-search.strategy';
import applyLocalSearchStrategy from '../composite/function.apply-local-search.strategy';
import getDeadLocationsService from '../composite/function.get-dead-locations.service';
import getProbabilityEngineService from '../composite/function.get-probability-engine.service';

describe('ProbabilityEngineService', () => {
    test('process on adopted disposition #1', () => {
        const probabilityEngineService: ProbabilityEngineService = getService(d1);

        expect(probabilityEngineService.getOffEdgeProb).toBe(0.87487);
        expect(probabilityEngineService.cutOffProbability).toBe(0.88858464);
        expect(probabilityEngineService.bestProbability).toBe(0.925609);
    });
    test('process on adopted disposition #1', () => {
        const probabilityEngineService: ProbabilityEngineService = getService(d2);

        expect(probabilityEngineService.getOffEdgeProb).toBe(0.846856);
        expect(probabilityEngineService.cutOffProbability).toBe(0.8726601599999999);
        expect(probabilityEngineService.bestProbability).toBe(0.909021);
    });
});

function getService(disposition: number[][]): ProbabilityEngineService
{
    const mines: number = 40;

    const boardStateService = getBoardStateService(disposition, mines);
    const binomialEngine: Binomial = new Binomial(1000000, 100);
    const witnessWebService: WitnessWebService = getWitnessWebService(boardStateService, binomialEngine);

    applyTrivialSearchStrategy(boardStateService, witnessWebService);

    expect(
        boardStateService.getBoardState.getActions.filter(a => ActionType.Clear === a.type).length
    ).toBe(0);

    applyLocalSearchStrategy(boardStateService, witnessWebService);

    expect(
        boardStateService.getBoardState.getActions.filter(a => ActionType.Clear === a.type).length
    ).toBe(0);

    const deadLocationsService: DeadLocationsService = getDeadLocationsService(
        boardStateService,
        witnessWebService
    );
    
    return getProbabilityEngineService(
        boardStateService, 
        witnessWebService, 
        binomialEngine, 
        deadLocationsService
    );
}
