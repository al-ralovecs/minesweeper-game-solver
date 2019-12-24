import {AbstractStrategy, StrategyType} from "./abstract-strategy";
import WitnessWebDto from "../dto/witness-web.dto";
import ProbabilityDistributionDto, { PROBABILITY_ENGINE_TOLERANCE } from "../dto/probability-distribution.dto";
import BoardStateDto from "../dto/board-state.dto";
import ProbabilityEngineService from "../service/probability-engine.service";

export default class CertainSolutionsStrategy extends AbstractStrategy
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

	// there is only one solution
	// or the solutions are certainties
	protected get isStrategyApplicable(): boolean
	{
		return 1 === ProbabilityEngineService.getBestCandidates(
				this.boardState,
				this.probabilityDistribution,
				PROBABILITY_ENGINE_TOLERANCE
			).length
			|| this.probabilityDistribution.foundCertainty;
	}

	protected applyStrategy(): void {
	}

	protected get getMoveMethod(): StrategyType
	{
		return StrategyType.CertainSolutions;
	}

}

/**
 *

 else if (bestCandidates.size() == 1 || certainClearFound ) { // if there is only one solution or the solutions are certainties

        		// register all the moves
        		for (CandidateLocation cl: bestCandidates) {
        			Action move = cl.buildAction(MoveMethod.PROBABILITY_ENGINE);
            		//if (move.getAction() == Action.FLAG) {
            		//	boardState.setFlagConfirmed(move);
            		//}
        	    	// let the boardState decide what to do with this action
        			boardState.setAction(move);

        		}

        		// if we have a certain clear then also register all the mines
        		if (certainClearFound) {
            		display("Found " + pe.getMines().size() + " mines using the probability engine");
            		for (Location loc: pe.getMines()) {
            	    	// let the boardState decide what to do with this action
            			boardState.setAction(new Action(loc, Action.FLAG, MoveMethod.PROBABILITY_ENGINE, "",  BigDecimal.ONE));
            		}

        		}

    	        Action[] moves = boardState.getActions().toArray(new Action[0]);
    			fm = new FinalMoves(moves);

    		}
 */