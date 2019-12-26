import { AbstractStrategy, StrategyType } from './abstract-strategy';
import BoardStateDto from '../dto/board-state.dto';
import WitnessWebDto from '../dto/witness-web.dto';
import ProbabilityDistributionDto from '../dto/probability-distribution.dto';
import ActionDto, { ActionType } from '../dto/action.dto';

export default class CertainSolutionsStrategy extends AbstractStrategy {
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

	// there is only one solution
	// or the solutions are certainties
	protected get isStrategyApplicable(): boolean {
		return 1 === this.probabilityDistribution.bestCandidates.length
			|| this.probabilityDistribution.foundCertainty;
	}

	protected applyStrategy(): void {
		this.probabilityDistribution.bestCandidates.forEach((cl) => {
			this.boardState.setAction = cl.buildAction(StrategyType.CertainSolutions);
		});
		
		if (this.probabilityDistribution.foundCertainty) {
			this.probabilityDistribution.mines.forEach((loc) => {
				this.boardState.setAction = new ActionDto(loc, ActionType.Flag, StrategyType.CertainSolutions, 1);
			});
		}
	}

	protected get getMoveMethod(): StrategyType {
		return StrategyType.CertainSolutions;
	}
}
