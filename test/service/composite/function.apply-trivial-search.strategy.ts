import BoardStateService from '../../../src/service/board-state.service';
import WitnessWebService from '../../../src/service/witness-web.service';
import TrivialSearchStrategy from '../../../src/strategy/trivial-search.strategy';

export default function applyTrivialSearchStrategy(
    boardStateService: BoardStateService, 
    witnessWebService: WitnessWebService
): void {
    new TrivialSearchStrategy(
        boardStateService.getBoardState,
        witnessWebService.getWitnessWeb
    )
        .apply();
}
