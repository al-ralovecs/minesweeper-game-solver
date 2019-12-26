import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import Binomial from '../../../src/minesweeper/utility/binomial';

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
