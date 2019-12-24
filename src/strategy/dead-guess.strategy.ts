import {AbstractStrategy, StrategyType} from './abstract-strategy';

import BoardStateDto from '../dto/board-state.dto';
import WitnessWebDto from '../dto/witness-web.dto';
import ProbabilityDistributionDto from '../dto/probability-distribution.dto';

import AreaDto from '../dto/area.dto';
import LocationDto from '../dto/location.dto';

import guess from './guess-methods/chose-guess.method';

export default class DeadGuessStrategy extends AbstractStrategy
{
    private readonly wholeEdge: WitnessWebDto;
    private readonly probabilityDistribution: ProbabilityDistributionDto;

    private deadLocations: AreaDto;

    public constructor(
        boardState: BoardStateDto,
        wholeEdge: WitnessWebDto,
        probabilityDistribution: ProbabilityDistributionDto,
        deadLocations: AreaDto
    ) {
        super(boardState);

        this.wholeEdge = wholeEdge;
        this.probabilityDistribution = probabilityDistribution;

        this.deadLocations = deadLocations;
    }

    // if all the locations are dead
    protected get isStrategyApplicable(): boolean
    {
        const allWitnesses: LocationDto[] = this.boardState.getAllLivingWitnesses;
        const allWitnessedSquares: AreaDto = this.boardState.getUnrevealedArea(allWitnesses);

        return 0 !== this.deadLocations.size
            && this.deadLocations.size === allWitnessedSquares.size;
    }

    // then just use any one
    protected applyStrategy(): void
    {
        guess(this.boardState, this.wholeEdge, this.probabilityDistribution, this.getMoveMethod);
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.DeadGuess;
    }
}
