import Binomial from '../../../src/minesweeper/utility/binomial';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';
import DeadLocationsService from '../../../src/minesweeper/service/dead-locations.service';

import { ActionType } from '../../../src/minesweeper/dto/action.dto';

import getBoardStateService from '../composite/function.get-board-state.service';
import getWitnessWebService from '../composite/function.get-witness-web.service';
import applyTrivialSearchStrategy from '../composite/function.apply-trivial-search.strategy';
import applyLocalSearchStrategy from '../composite/function.apply-local-search.strategy';
import getDeadLocationsService from '../composite/function.get-dead-locations.service';
import BinomialSetupDto from "../../../src/minesweeper/dto/binomial-setup.dto";

export default function getService(disposition: number[][], minesTotal: number): DeadLocationsService
{
    const boardStateService = getBoardStateService(disposition, minesTotal);
    const binomialEngine: Binomial = new Binomial(new BinomialSetupDto(1000000, 100));
    const witnessWebService: WitnessWebService = getWitnessWebService(boardStateService, binomialEngine);

    applyTrivialSearchStrategy(boardStateService, witnessWebService);

    expect(
        boardStateService.getBoardState.getActions.filter(a => ActionType.Clear === a.type).length
    ).toBe(0);

    applyLocalSearchStrategy(boardStateService, witnessWebService);

    expect(
        boardStateService.getBoardState.getActions.filter(a => ActionType.Clear === a.type).length
    ).toBe(0);

    return getDeadLocationsService(
        boardStateService,
        witnessWebService
    );
}
