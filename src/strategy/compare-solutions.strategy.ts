import {AbstractStrategy, StrategyType} from "./abstract-strategy";
import ProbabilityDistributionDto, {PROBABILITY_ENGINE_TOLERANCE} from "../dto/probability-distribution.dto";
import WitnessWebDto from "../dto/witness-web.dto";
import BoardStateDto from "../dto/board-state.dto";
import ProbabilityEngineService from "../service/probability-engine.service";

export default class CompareSolutionsStrategy extends AbstractStrategy
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

    protected get isStrategyApplicable(): boolean
    {
        return 1 < ProbabilityEngineService.getBestCandidates(
                this.boardState,
                this.probabilityDistribution,
                PROBABILITY_ENGINE_TOLERANCE
            ).length
    }

    protected applyStrategy(): void
    {
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.CompareRemainingSolutions;
    }

}

/**
 // fetch the best candidates from the edge
 List<CandidateLocation> bestCandidates = pe.getBestCandidates(PROB_ENGINE_TOLERENCE);
 *
 {    // evaluate which of the best candidates to choose
        		display("About to evaluate best candidates -->");
        		evaluateLocations.evaluateLocations(bestCandidates);
        		display("<-- Done");

        		evaluateLocations.showResults();

        		Action[] moves = evaluateLocations.bestMove();
        		fm = new FinalMoves(moves);

    		}
 */