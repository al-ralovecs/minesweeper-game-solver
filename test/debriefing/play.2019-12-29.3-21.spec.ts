import { disposition } from '../__fixtures__/board/2019-12-29.3-21.json';
import Binomial from '../../src/minesweeper/utility/binomial';
import Play from '../../src/minesweeper/play';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import ActionDto, { ActionType } from '../../src/minesweeper/dto/action.dto';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import { StrategyType } from '../../src/minesweeper/strategy/abstract-strategy';
import { BoardParserHelper } from '../../src/app/helper/board-parser.helper';
import BinomialSetupDto from "../../src/minesweeper/dto/binomial-setup.dto";

describe('Play: on Dec. 29, at 3:31', () => {
    test('debriefing', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 16);

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(disposition[0])))).toStrictEqual(
            new ActionDto(new LocationDto(0, 7), ActionType.Clear, StrategyType.FinalGuess, 0.5)
        );
    });
});
