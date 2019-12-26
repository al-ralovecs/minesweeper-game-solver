import {disposition} from '../__fixtures__/state/16x16x40.pe.most-info.json';
import BoardDto from '../../src/minesweeper/dto/board.dto';
import Play from '../../src/minesweeper/component/play';
import Binomial from '../../src/minesweeper/utility/binomial';
import ActionDto, {ActionType} from '../../src/minesweeper/dto/action.dto';
import LocationDto from '../../src/minesweeper/dto/location.dto';
import {StrategyType} from '../../src/minesweeper/strategy/abstract-strategy';

describe('Play: Probability Engine results', () => {
    test('check if probability distribution matches', () => {
        const binomialEngine: Binomial = new Binomial(1000000, 100);
        const play: Play = new Play(binomialEngine, 40);

        expect(play.getNextMove(new BoardDto(disposition))).toStrictEqual(
            new ActionDto(new LocationDto(3, 0), ActionType.Clear, StrategyType.CompareRemainingSolutions, 0.909021)
        );

        expect(play.getProbabilityDistribution.offEdgeProbability).toBe(0.846856);
        expect(play.getProbabilityDistribution.cutOffProbability).toBe(0.8726601599999999);
        expect(play.getProbabilityDistribution.bestProbability).toBe(0.909021);

        expect(play.getProbabilityDistribution.finalSolutionsCount).toBe(65440180405755034802956944110186053027765389n);

        expect(play.getProbabilityDistribution.boxProb).toMatchSnapshot();
    });
});
