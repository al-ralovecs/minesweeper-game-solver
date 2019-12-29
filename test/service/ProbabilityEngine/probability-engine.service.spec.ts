import { disposition as d1 } from '../../__fixtures__/state/16x16x40.pe.best-probability.json';
import { disposition as d2} from '../../__fixtures__/state/16x16x40.pe.most-info.json';

import Binomial from '../../../src/minesweeper/utility/binomial';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import DeadLocationsService from '../../../src/minesweeper/service/dead-locations.service';
import ProbabilityEngineService from '../../../src/minesweeper/service/probability-engine.service';

import { ActionType } from '../../../src/minesweeper/dto/action.dto';

import getBoardStateService from '../composite/function.get-board-state.service';
import getWitnessWebService from '../composite/function.get-witness-web.service';
import applyTrivialSearchStrategy from '../composite/function.apply-trivial-search.strategy';
import applyLocalSearchStrategy from '../composite/function.apply-local-search.strategy';
import getDeadLocationsService from '../composite/function.get-dead-locations.service';
import getProbabilityEngineService from '../composite/function.get-probability-engine.service';
import BinomialSetupDto from "../../../src/minesweeper/dto/binomial-setup.dto";

describe('ProbabilityEngineService', () => {
    test('process on adopted disposition #1', () => {
        const probabilityEngineService: ProbabilityEngineService = getService(d1);

        expect(probabilityEngineService.getProbabilityDistribution.offEdgeProbability).toBe(0.87487);
        expect(probabilityEngineService.getProbabilityDistribution.cutOffProbability).toBe(0.88858464);
        expect(probabilityEngineService.getProbabilityDistribution.bestProbability).toBe(0.925609);

        expect(probabilityEngineService.getProbabilityDistribution.finalSolutionsCount).toBe(8007791515419721373659802075269356n);

        expect(probabilityEngineService.getProbabilityDistribution.boxProb).toMatchSnapshot();
    });
    test('process on adopted disposition #1', () => {
        const probabilityEngineService: ProbabilityEngineService = getService(d2);

        expect(probabilityEngineService.getProbabilityDistribution.offEdgeProbability).toBe(0.846856);
        expect(probabilityEngineService.getProbabilityDistribution.cutOffProbability).toBe(0.8726601599999999);
        expect(probabilityEngineService.getProbabilityDistribution.bestProbability).toBe(0.909021);

        expect(probabilityEngineService.getProbabilityDistribution.finalSolutionsCount).toBe(65440180405755034802956944110186053027765389n);
    });
});

function getService(disposition: number[][]): ProbabilityEngineService
{
    const mines: number = 40;

    const boardStateService = getBoardStateService(disposition, mines);
    const binomialEngine: Binomial = new Binomial(new BinomialSetupDto(1000000, 100));
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
