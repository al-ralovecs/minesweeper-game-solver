import {disposition} from '../__fixtures__/state/16x16x40.pe.best-probability.json';
import BoardDto from '../../src/dto/board.dto';
import Play from '../../src/component/play';
import Binomial from '../../src/utility/binomial';
import ActionDto, {ActionType} from "../../src/dto/action.dto";
import LocationDto from "../../src/dto/location.dto";
import {StrategyType} from "../../src/strategy/abstract-strategy";

describe('Play: Probability Engine results', () => {
    test('check if probability distribution matches', () => {
        const board = new BoardDto(disposition);
        const binomialEngine: Binomial = new Binomial(1000000, 100);
        const play: Play = new Play(board, binomialEngine, 40);

        expect(play.getNextMove).toStrictEqual(
            new ActionDto(new LocationDto(2, 7), ActionType.Clear, StrategyType.CompareRemainingSolutions, 0.925609)
        );

        expect(play.getProbabilityDistribution.offEdgeProbability).toBe(0.87487);
        expect(play.getProbabilityDistribution.cutOffProbability).toBe(0.88858464);
        expect(play.getProbabilityDistribution.bestProbability).toBe(0.925609);

        expect(play.getProbabilityDistribution.finalSolutionsCount).toBe(8007791515419721373659802075269356n);

        expect(play.getProbabilityDistribution.boxProb).toMatchSnapshot();
    });
});
