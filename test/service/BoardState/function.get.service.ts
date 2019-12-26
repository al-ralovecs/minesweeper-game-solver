import Binomial from '../../../src/minesweeper/utility/binomial';
import BoardStateService from '../../../src/minesweeper/service/board-state.service';
import WitnessWebService from '../../../src/minesweeper/service/witness-web.service';

import { ActionType } from '../../../src/minesweeper/dto/action.dto';

import getBoardStateService from '../composite/function.get-board-state.service';
import getWitnessWebService from '../composite/function.get-witness-web.service';
import applyTrivialSearchStrategy from '../composite/function.apply-trivial-search.strategy';
import applyLocalSearchStrategy from '../composite/function.apply-local-search.strategy';
import {StrategyType} from '../../../src/minesweeper/strategy/abstract-strategy';

export default function getService(
    disposition: number[][],
    minesTotal: number,
    expectedOnTrivial: number = 0,
    expectedOnLocal: number = 0
): BoardStateService {
    const boardStateService = getBoardStateService(disposition, minesTotal);
    const binomialEngine: Binomial = new Binomial(1000000, 100);
    const witnessWebService: WitnessWebService = getWitnessWebService(boardStateService, binomialEngine);

    applyTrivialSearchStrategy(boardStateService, witnessWebService);

    expect(
        boardStateService.getBoardState
            .getActions
            .filter(a => ActionType.Clear === a.type && StrategyType.TrivialSearch === a.moveMethod)
            .length
    ).toBe(expectedOnTrivial);

    applyLocalSearchStrategy(boardStateService, witnessWebService);

    expect(
        boardStateService.getBoardState
            .getActions
            .filter(a => ActionType.Clear === a.type && StrategyType.LocalSearch === a.moveMethod)
            .length
    ).toBe(expectedOnLocal);

    return boardStateService;
}
