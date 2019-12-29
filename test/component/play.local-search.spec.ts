import { disposition } from '../__fixtures__/state/4x4.local-search.json';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import Play from '../../src/minesweeper/play';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import Binomial from '../../src/minesweeper/utility/binomial';
import ActionDto, {ActionType} from '../../src/minesweeper/dto/action.dto';
import {StrategyType} from '../../src/minesweeper/strategy/abstract-strategy';
import BinomialSetupDto from "../../src/minesweeper/dto/binomial-setup.dto";

describe('Play: LocalSearch strategy', () => {
    test('check if provides a move', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 2);

        expect(play.getNextMove(new BoardDto(disposition))).toStrictEqual(
            new ActionDto(new LocationDto(2, 2), ActionType.Clear, StrategyType.LocalSearch, 1)
        );
    });
});
