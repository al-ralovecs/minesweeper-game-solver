import { AbstractStrategy, StrategyType } from './abstract-strategy';

import BoardStateDto from '../dto/board-state.dto';
import WitnessWebDto from '../dto/witness-web.dto';
import ProbabilityDistributionDto from '../dto/probability-distribution.dto';

import guess from './guess-methods/chose-guess.method';

export default class FinalGuessStrategy extends AbstractStrategy {
    private readonly wholeEdge: WitnessWebDto;
    private readonly probabilityDistribution: ProbabilityDistributionDto;

    public constructor(
        boardState: BoardStateDto,
        wholeEdge: WitnessWebDto,
        probabilityDistribution: ProbabilityDistributionDto,
    ) {
        super(boardState);

        this.wholeEdge = wholeEdge;
        this.probabilityDistribution = probabilityDistribution;
    }
    
    protected applyStrategy(): void {
        guess(this.boardState, this.wholeEdge, this.probabilityDistribution, this.getMoveMethod);
    }

    protected get getMoveMethod(): StrategyType {
        return StrategyType.FinalGuess;
    }
}
