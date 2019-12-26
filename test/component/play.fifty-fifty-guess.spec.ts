import { disposition } from '../__fixtures__/state/7x6.fifty-fifty-guess.json';
import BoardDto from '../../src/dto/board.dto';
import Play from '../../src/component/play';
import LocationDto from '../../src/dto/location.dto';
import Binomial from '../../src/utility/binomial';
import ActionDto, {ActionType} from '../../src/dto/action.dto';
import {StrategyType} from '../../src/strategy/abstract-strategy';

describe('Play: Fifty-Fifty Guess strategy', () => {
    test('check if provides a move', () => {
        const binomialEngine: Binomial = new Binomial(1000000, 100);
        const play: Play = new Play(binomialEngine, 8);

        expect(play.getNextMove(new BoardDto(disposition))).toStrictEqual(
            new ActionDto(new LocationDto(4, 5), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.5)
        );
    });
});
