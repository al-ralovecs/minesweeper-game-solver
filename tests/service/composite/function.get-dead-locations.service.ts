import BoardStateService from '../../../src/service/board-state.service';
import WitnessWebService from '../../../src/service/witness-web.service';
import DeadLocationsService from '../../../src/service/dead-locations.service';

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
