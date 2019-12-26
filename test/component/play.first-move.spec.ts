import { disposition } from '../__fixtures__/state/10x10.empty.json';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import Play from '../../src/minesweeper/component/play';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import Binomial from '../../src/minesweeper/utility/binomial';
import ActionDto, {ActionType} from '../../src/minesweeper/dto/action.dto';
import {StrategyType} from '../../src/minesweeper/strategy/abstract-strategy';

describe('Play: FirstMove strategy', () => {
    test('check if provides first move', () => {
        const binomialEngine: Binomial = new Binomial(1000000, 100);
        const play: Play = new Play(binomialEngine, 16);

        expect(play.getNextMove(new BoardDto(disposition))).toStrictEqual(
            new ActionDto(new LocationDto(4, 4), ActionType.Clear, StrategyType.FirstMove, 1)
        );
    });
});
