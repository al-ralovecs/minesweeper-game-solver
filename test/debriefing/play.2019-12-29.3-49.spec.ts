import { dynamicDisposition } from '../__fixtures__/board/2019-12-29.3-49.json';
import Binomial from '../../src/minesweeper/utility/binomial';
import Play from '../../src/minesweeper/play';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import ActionDto, { ActionType } from '../../src/minesweeper/dto/action.dto';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import { StrategyType } from '../../src/minesweeper/strategy/abstract-strategy';
import { BoardParserHelper } from '../../src/app/helper/board-parser.helper';
import {disposition} from "../__fixtures__/board/2019-12-29.1-07.json";
import BinomialSetupDto from "../../src/minesweeper/dto/binomial-setup.dto";

describe('Play: on Dec. 29, at 3:49', () => {
    test('debriefing', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 16);

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[0])))).toStrictEqual(
            new ActionDto(new LocationDto(4, 4), ActionType.Clear, StrategyType.FirstMove, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[1])))).toStrictEqual(
            new ActionDto(new LocationDto(0, 0), ActionType.Clear, StrategyType.OffEdgeEvaluation, 0.846154)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[2])))).toStrictEqual(
            new ActionDto(new LocationDto(5, 4), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[3])))).toStrictEqual(
            new ActionDto(new LocationDto(0, 3), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[4])))).toStrictEqual(
            new ActionDto(new LocationDto(6, 4), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[5])))).toStrictEqual(
            new ActionDto(new LocationDto(2, 4), ActionType.Clear, StrategyType.TrivialSearch, 1)
        );

        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[6])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 4), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[7])))).toStrictEqual(
        //     new ActionDto(new LocationDto(7, 2), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[8])))).toStrictEqual(
        //     new ActionDto(new LocationDto(1, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[9])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[10])))).toStrictEqual(
        //     new ActionDto(new LocationDto(2, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[11])))).toStrictEqual(
        //     new ActionDto(new LocationDto(3, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[12])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 6), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[13])))).toStrictEqual(
        //     new ActionDto(new LocationDto(4, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[14])))).toStrictEqual(
        //     new ActionDto(new LocationDto(5, 6), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[15])))).toStrictEqual(
        //     new ActionDto(new LocationDto(6, 5), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[16])))).toStrictEqual(
        //     new ActionDto(new LocationDto(7, 6), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[17])))).toStrictEqual(
        //     new ActionDto(new LocationDto(7, 7), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[18])))).toStrictEqual(
        //     new ActionDto(new LocationDto(7, 8), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[19])))).toStrictEqual(
        //     new ActionDto(new LocationDto(7, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[20])))).toStrictEqual(
        //     new ActionDto(new LocationDto(8, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[21])))).toStrictEqual(
        //     new ActionDto(new LocationDto(8, 6), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[22])))).toStrictEqual(
        //     new ActionDto(new LocationDto(8, 8), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[23])))).toStrictEqual(
        //     new ActionDto(new LocationDto(8, 9), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[24])))).toStrictEqual(
        //     new ActionDto(new LocationDto(7, 3), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[25])))).toStrictEqual(
        //     new ActionDto(new LocationDto(9, 9), ActionType.Clear, StrategyType.LocalSearch, 1)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[26])))).toStrictEqual(
        //     new ActionDto(new LocationDto(0, 9), ActionType.Clear, StrategyType.CompareRemainingSolutions, 0.926702)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[27])))).toStrictEqual(
        //     new ActionDto(new LocationDto(9, 0), ActionType.Clear, StrategyType.CompareRemainingSolutions, 0.926702)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[28])))).toStrictEqual(
        //     new ActionDto(new LocationDto(3, 3), ActionType.Clear, StrategyType.FinalGuess, 0.98323)
        // );
        //
        // expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[29])))).toStrictEqual(
        //     new ActionDto(new LocationDto(7, 5), ActionType.Clear, StrategyType.TrivialSearch, 1)
        // );
    });
    test('test in isolation: final guess', () => {
        const play: Play = new Play(new BinomialSetupDto(1000000, 100), 16);

        expect(play.getNextMove(new BoardDto(BoardParserHelper.parse(dynamicDisposition[29])))).toStrictEqual(
            new ActionDto(new LocationDto(9, 3), ActionType.Clear, StrategyType.OffEdgeEvaluation, 0.923077)
        );
    });
});