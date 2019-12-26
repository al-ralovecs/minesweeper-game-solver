import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import TrivialSearchStrategy from '../../../src/minesweeper/strategy/trivial-search.strategy';

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
