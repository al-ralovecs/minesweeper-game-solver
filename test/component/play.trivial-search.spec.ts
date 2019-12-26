import { disposition } from '../__fixtures__/state/4x6.trivial-search.json';
import BoardDto from '../../src/dto/board.dto';
import Play from '../../src/component/play';
import LocationDto from '../../src/dto/location.dto';
import Binomial from '../../src/utility/binomial';
import ActionDto, {ActionType} from '../../src/dto/action.dto';
import { StrategyType } from '../../src/strategy/abstract-strategy';

describe('Play: TrivialSearch strategy', () => {
    test('check if provides a move', () => {
        const board = new BoardDto(disposition);
        const binomialEngine: Binomial = new Binomial(1000000, 100);
        const play: Play = new Play(board, binomialEngine, 16);

        expect(play.getNextMove).toStrictEqual(
            new ActionDto(new LocationDto(4, 0), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );
    });
});