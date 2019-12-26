import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import Binomial from '../../../src/minesweeper/utility/binomial';
import DeadLocationsService from '../../../src/minesweeper/service/dead-locations.service';
import ProbabilityEngineService from '../../../src/minesweeper/service/probability-engine.service';

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
