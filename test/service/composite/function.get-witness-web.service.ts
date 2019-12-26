import BoardStateService from '../../../src/service/board-state.service';
import WitnessWebService from '../../../src/service/witness-web.service';
import Binomial from '../../../src/utility/binomial';

export default function getWitnessWebService(
    boardStateService: BoardStateService,
    binomialEngine: Binomial
): WitnessWebService {
    const witnessWebService: WitnessWebService = new WitnessWebService(
        boardStateService.getBoardState,
        binomialEngine
    );
    witnessWebService.process();

    return witnessWebService;
}
