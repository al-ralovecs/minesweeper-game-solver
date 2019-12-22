import { AbstractStrategy, StrategyType } from './abstract-strategy';
import BoardStateDto from "../dto/board-state.dto";
import WitnessWebDto from "../dto/witness-web.dto";
import ProbabilityDistributionDto from "../dto/probability-distribution.dto";

const preferences = {
    ALLOWABLE_SOLUTIONS_MAXIMUM: 4000,
};

export default class BruteForceStrategy extends AbstractStrategy
{
    private readonly wholeEdge: WitnessWebDto;
    private readonly probabilityDistribution: ProbabilityDistributionDto;

    public constructor(
        boardState: BoardStateDto,
        wholeEdge: WitnessWebDto,
        probabilityDistribution: ProbabilityDistributionDto
    ) {
        super(boardState);

        this.wholeEdge = wholeEdge;
        this.probabilityDistribution = probabilityDistribution;
    }

    // if the number of candidate solutions is not greater than the allowable maximum
    protected get isStrategyApplicable(): boolean
    {
        return false;

        // return 0 > this.probabilityDistribution.finalSolutionsCount - preferences.ALLOWABLE_SOLUTIONS_MAXIMUM
        //     && ! this.probabilityDistribution.foundCertainty;
    }

    protected applyStrategy(): void
    {
        // @todo: implement
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.BruteForce;
    }
}
