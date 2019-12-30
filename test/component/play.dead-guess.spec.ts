import { disposition } from '../__fixtures__/state/3x3.single-dead.json';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import Play from '../../src/minesweeper/play';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import ActionDto, {ActionType} from '../../src/minesweeper/dto/action.dto';
import {StrategyType} from '../../src/minesweeper/strategy/abstract-strategy';
import BinomialSetupDto from '../../src/minesweeper/dto/binomial-setup.dto';

describe('Play: Dead-Guess strategy', () => {
    test('check if provides a move', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 7);

        expect(play.getNextMove(new BoardDto(disposition))).toStrictEqual(
            new ActionDto(new LocationDto(0, 0), ActionType.Clear, StrategyType.DeadGuess, 0.125)
        );
    });
});
