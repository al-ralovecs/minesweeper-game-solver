import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import LocalSearchStrategy from '../../../src/minesweeper/strategy/local-search.strategy';

export default function applyLocalSearchStrategy(
    boardStateService: BoardStateService, 
    witnessWebService: WitnessWebService
): void {
    new LocalSearchStrategy(
        boardStateService.getBoardState,
        witnessWebService.getWitnessWeb
    )
        .apply();
}
