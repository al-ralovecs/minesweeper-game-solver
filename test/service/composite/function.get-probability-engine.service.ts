import BoardStateService from '../../../src/service/board-state.service';
import WitnessWebService from '../../../src/service/witness-web.service';
import Binomial from '../../../src/utility/binomial';
import DeadLocationsService from '../../../src/service/dead-locations.service';
import ProbabilityEngineService from '../../../src/service/probability-engine.service';

export default function getProbabilityEngineService(
    boardStateService: BoardStateService,
    witnessWebService: WitnessWebService,
    binomialEngine: Binomial,
    deadLocationsService: DeadLocationsService
): ProbabilityEngineService {
    const probabilityEngineService = new ProbabilityEngineService(
        boardStateService.getBoardState,
        witnessWebService.getWitnessWeb,
        binomialEngine,
        deadLocationsService.getData
    );
    probabilityEngineService.process();

    return probabilityEngineService;
}
