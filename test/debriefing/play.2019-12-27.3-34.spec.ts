import { dynamicDisposition } from '../__fixtures__/board/2019-12-27.3-34.json';
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
        
        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[0])))).toStrictEqual(
            new ActionDto(new LocationDto(4, 4), ActionType.Clear, StrategyType.FirstMove, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[1])))).toStrictEqual(
            new ActionDto(new LocationDto(8, 2), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[2])))).toStrictEqual(
            new ActionDto(new LocationDto(1, 1), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[3])))).toStrictEqual(
            new ActionDto(new LocationDto(1, 9), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[4])))).toStrictEqual(
            new ActionDto(new LocationDto(2, 0), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[5])))).toStrictEqual(
            new ActionDto(new LocationDto(8, 3), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[6])))).toStrictEqual(
            new ActionDto(new LocationDto(8, 4), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[7])))).toStrictEqual(
            new ActionDto(new LocationDto(9, 1), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[8])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 2), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[9])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 3), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[10])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 6), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[11])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 9), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[12])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 0), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[13])))).toStrictEqual(
        //     new ActionDto(new LocationDto(1, 0), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[14])))).toStrictEqual(
        //     new ActionDto(new LocationDto(9, 1), ActionType.Clear, StrategyType.OffEdgeEvaluation, 1.571984)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[15])))).toStrictEqual(
        //     new ActionDto(new LocationDto(9, 0), ActionType.Clear, StrategyType.OffEdgeEvaluation, 1.571984)
        // );
    });
});