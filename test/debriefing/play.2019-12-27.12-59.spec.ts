import { disposition } from '../__fixtures__/board/2019-12-27.12-59.json';
import Binomial from '../../src/minesweeper/utility/binomial';
import Play from '../../src/minesweeper/play';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import ActionDto, { ActionType } from '../../src/minesweeper/dto/action.dto';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import { StrategyType } from '../../src/minesweeper/strategy/abstract-strategy';
import { BoardParserHelper } from '../../src/app/helper/board-parser.helper';
import BinomialSetupDto from "../../src/minesweeper/dto/binomial-setup.dto";

describe('Play: FirstMove strategy', () => {
    test('check if provides first move', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 16);

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(disposition[0])))).toStrictEqual(
            new ActionDto(new LocationDto(9, 3), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );
    });
});