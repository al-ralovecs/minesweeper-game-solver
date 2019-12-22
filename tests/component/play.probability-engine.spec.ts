import { disposition } from '../__fixtures__/state/16x16x40.pe.best-probability.json';
import BoardDto from '../../src/dto/board.dto';
import Play from '../../src/component/play';
import Binomial from '../../src/utility/binomial';

describe('Play: Probability Engine results', () => {
    test('check if probability distribution matches', () => {
        const board = new BoardDto(disposition);
        const binomialEngine: Binomial = new Binomial(1000000, 100);
        const play: Play = new Play(board, binomialEngine, 40);

        try {
            play.getNextMove;
        } catch (e) {
            //
        }

        expect(play.getProbabilityDistribution.offEdgeProbability).toBe(0.87487);
        expect(play.getProbabilityDistribution.cutOffProbability).toBe(0.88858464);
        expect(play.getProbabilityDistribution.bestProbability).toBe(0.925609);

        expect(play.getProbabilityDistribution.boxProb).toMatchSnapshot();
    });
});
