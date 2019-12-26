import {disposition} from '../__fixtures__/state/16x16x40.pe.best-probability.json';
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
            new ActionDto(new LocationDto(2, 7), ActionType.Clear, StrategyType.CompareRemainingSolutions, 0.925609)
        );

        expect(play.getProbabilityDistribution.offEdgeProbability).toBe(0.87487);
        expect(play.getProbabilityDistribution.cutOffProbability).toBe(0.88858464);
        expect(play.getProbabilityDistribution.bestProbability).toBe(0.925609);

        expect(play.getProbabilityDistribution.finalSolutionsCount).toBe(8007791515419721373659802075269356n);

        expect(play.getProbabilityDistribution.boxProb).toMatchSnapshot();
    });
});
