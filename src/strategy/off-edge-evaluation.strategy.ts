import { AbstractStrategy, StrategyType } from "./abstract-strategy";

import BoardStateDto from "../dto/board-state.dto";
import ProbabilityDistributionDto, {PROBABILITY_ENGINE_TOLERANCE} from "../dto/probability-distribution.dto";
import AreaDto from "../dto/area.dto";
import LocationDto from "../dto/location.dto";
import EvaluateLocationsService from "../service/evaluate-locations.service";

const OFF_EDGE_TOLERANCE: number = 0.97;

export default class OffEdgeEvaluationStrategy extends AbstractStrategy
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
        // are clears off the edge within the permitted cut-off
        return 0 < this.probabilityDistribution.offEdgeProbability - this.probabilityDistribution.bestProbability * OFF_EDGE_TOLERANCE
            && ! this.probabilityDistribution.foundCertainty;
    }

    protected applyStrategy(): void
    {
        this.evaluateLocationsService.addOffEdgeCandidates(
            this.boardState.getAllUnrevealedSquares
        );
        this.evaluateLocationsService.evaluateLocations(
            this.probabilityDistribution.getBestCandidates(PROBABILITY_ENGINE_TOLERANCE)
        );

        if (! this.evaluateLocationsService.hasBestMove) {
            return;
        }

        this.boardState.setAction = this.evaluateLocationsService.getBestMove;
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.OffEdgeEvaluation;
    }

}
