import { disposition } from '../__fixtures__/state/7x6.fifty-fifty-guess.json';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import Play from '../../src/minesweeper/play';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import Binomial from '../../src/minesweeper/utility/binomial';
import ActionDto, {ActionType} from '../../src/minesweeper/dto/action.dto';
import {StrategyType} from '../../src/minesweeper/strategy/abstract-strategy';
import BinomialSetupDto from "../../src/minesweeper/dto/binomial-setup.dto";

describe('Play: Fifty-Fifty Guess strategy', () => {
    test('check if provides a move', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 8);

        expect(play.getNextMove(new BoardDto(disposition))).toStrictEqual(
            new ActionDto(new LocationDto(4, 5), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.5)
        );
    });
});
