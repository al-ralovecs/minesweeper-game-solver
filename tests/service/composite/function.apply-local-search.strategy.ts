import BoardStateService from '../../../src/service/board-state.service';
import WitnessWebService from '../../../src/service/witness-web.service';
import LocalSearchStrategy from '../../../src/strategy/local-search.strategy';

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
