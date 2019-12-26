import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import DeadLocationsService from '../../../src/minesweeper/service/dead-locations.service';

export default function getDeadLocationsService(
    boardStateService: BoardStateService,
    witnessWebService: WitnessWebService
): DeadLocationsService {
    witnessWebService.setBoardState = boardStateService.getBoardState;
    witnessWebService.process();

    const deadLocationsService: DeadLocationsService = new DeadLocationsService(
        boardStateService.getBoardState,
        witnessWebService.getWitnessWeb.getPrunedWitnesses
    );
    deadLocationsService.process();

    return deadLocationsService;
}
