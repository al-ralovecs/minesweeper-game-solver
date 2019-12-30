import { dynamicDisposition } from '../__fixtures__/board/2019-12-29.0-03.json';
import Binomial from '../../src/minesweeper/utility/binomial';
import Play from '../../src/minesweeper/play';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import ActionDto, { ActionType } from '../../src/minesweeper/dto/action.dto';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import { StrategyType } from '../../src/minesweeper/strategy/abstract-strategy';
import { BoardParserHelper } from '../../src/app/helper/board-parser.helper';
import BinomialSetupDto from "../../src/minesweeper/dto/binomial-setup.dto";

describe('Play: on Dec. 29, at 0:03', () => {
    test('debriefing', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 16);

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[0])))).toStrictEqual(
            new ActionDto(new LocationDto(4, 4), ActionType.Clear, StrategyType.FirstMove, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[1])))).toStrictEqual(
            new ActionDto(new LocationDto(0, 0), ActionType.Clear, StrategyType.OffEdgeEvaluation, 0.846154)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[2])))).toStrictEqual(
            new ActionDto(new LocationDto(0, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[3])))).toStrictEqual(
        //     new ActionDto(new LocationDto(4, 5), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[4])))).toStrictEqual(
        //     new ActionDto(new LocationDto(1, 5), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[5])))).toStrictEqual(
        //     new ActionDto(new LocationDto(2, 5), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[6])))).toStrictEqual(
        //     new ActionDto(new LocationDto(5, 5), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[7])))).toStrictEqual(
        //     new ActionDto(new LocationDto(6, 4), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[8])))).toStrictEqual(
        //     new ActionDto(new LocationDto(6, 5), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[9])))).toStrictEqual(
        //     new ActionDto(new LocationDto(1, 6), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );

        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[10])))).toStrictEqual(
        //     new ActionDto(new LocationDto(9, 0), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[11])))).toStrictEqual(
        //     new ActionDto(new LocationDto(9, 9), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[12])))).toStrictEqual(
        //     new ActionDto(new LocationDto(3, 3), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[13])))).toStrictEqual(
        //     new ActionDto(new LocationDto(1, 6), ActionType.Clear, StrategyType.TrivialSearch, 1)
        //);
    });
    test('check in isolation', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 16);

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[9])))).toStrictEqual(
            new ActionDto(new LocationDto(1, 6), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );
    });
    test('check earlier move in isolation', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 16);

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[2])))).toStrictEqual(
            new ActionDto(new LocationDto(0, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );
    });
});