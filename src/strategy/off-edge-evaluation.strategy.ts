import { AbstractStrategy, StrategyType } from "./abstract-strategy";

import BoardStateDto from "../dto/board-state.dto";
import ProbabilityDistributionDto from "../dto/probability-distribution.dto";

const OFF_EDGE_TOLERANCE: number = 0.97;

export default class OffEdgeEvaluationStrategy extends AbstractStrategy
{
    private readonly probabilityDistribution: ProbabilityDistributionDto;

    public constructor(
        boardState: BoardStateDto,
        probabilityDistribution: ProbabilityDistributionDto
    ) {
        super(boardState);

        this.probabilityDistribution = probabilityDistribution;
    }

    protected get isStrategyApplicable(): boolean
    {
        // are clears off the edge within the permitted cut-off
        return 0 < this.probabilityDistribution.offEdgeProbability - this.probabilityDistribution.bestProbability * OFF_EDGE_TOLERANCE
            && ! this.probabilityDistribution.foundCertainty;
    }

    protected applyStrategy(): void
    {
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.OffEdgeEvaluation;
    }

}

/**


        		if (allUnrevealedSquares == null) {   // defer this until we need it, can be expensive
        			allUnrevealedSquares = boardState.getAllUnrevealedSquares();
        		}

            	evaluateLocations.addOffEgdeCandidates(allUnrevealedSquares);
            	evaluateLocations.evaluateLocations(bestCandidates);

            	evaluateLocations.showResults();

        		Action[] moves = evaluateLocations.bestMove();
        		fm = new FinalMoves(moves);

        	}
 */