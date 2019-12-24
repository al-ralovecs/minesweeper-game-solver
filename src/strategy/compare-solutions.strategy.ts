import { AbstractStrategy, StrategyType } from './abstract-strategy';
import BoardStateDto from '../dto/board-state.dto';
import ProbabilityDistributionDto from '../dto/probability-distribution.dto';
import EvaluateLocationsService from '../service/evaluate-locations.service';

export default class CompareSolutionsStrategy extends AbstractStrategy
{
    private readonly probabilityDistribution: ProbabilityDistributionDto;
    private readonly evaluateLocationsService: EvaluateLocationsService;

    public constructor(
        boardState: BoardStateDto,
        probabilityDistribution: ProbabilityDistributionDto,
        evaluateLocationsService: EvaluateLocationsService
    ) {
        super(boardState);

        this.probabilityDistribution = probabilityDistribution;
        this.evaluateLocationsService = evaluateLocationsService;
    }

    protected get isStrategyApplicable(): boolean
    {
        return 1 < this.probabilityDistribution.bestCandidates.length
    }

    protected applyStrategy(): void
    {
        this.evaluateLocationsService.evaluateLocations(this.probabilityDistribution.bestCandidates);
        
        if (! this.evaluateLocationsService.hasBestMove) {
            return;
        }
        
        this.evaluateLocationsService.setMoveMethod = this.getMoveMethod;
        this.boardState.setAction = this.evaluateLocationsService.getBestMove;
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.CompareRemainingSolutions;
    }
}
