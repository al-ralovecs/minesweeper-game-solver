import { AbstractStrategy, StrategyType } from './abstract-strategy';
import BoardStateDto from '../dto/board-state.dto';
import WitnessWebDto from '../dto/witness-web.dto';
import ProbabilityDistributionDto from '../dto/probability-distribution.dto';
import AreaDto from '../dto/area.dto';
import LocationDto from '../dto/location.dto';
import ActionDto, { ActionType } from '../dto/action.dto';
import CandidateLocationDto from '../dto/candidate-location.dto';

export default class DeadGuessStrategy extends AbstractStrategy
{
    private readonly wholeEdge: WitnessWebDto;
    private readonly probabilityDistribution: ProbabilityDistributionDto;

    private deadLocations: AreaDto;
    private allWitnessedSquares: AreaDto;

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

        this.init();
    }

    // if all the locations are dead
    // then just use any one
    apply(): void
    {
        if (! this.isThisStrategyRequired) {
            return;
        }

        if (0 === this.allWitnessedSquares.getLocations.data.length) {
            return this.guess();
        }

        return this.pick();
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.DeadGuess;
    }

    private get isThisStrategyRequired(): boolean
    {
        return 0 !== this.deadLocations.size
            && this.deadLocations.size === this.allWitnessedSquares.size;
    }

    // look for a guess off the edge
    private guess(): void
    {
        let candidateList: CandidateLocationDto[] = [];

        for (let i: number = 0; i < this.boardState.height; i++) {
            for (let j: number = 0; j < this.boardState.width; j++) {
                const location: LocationDto = new LocationDto(i, j);

                if (! this.boardState.isUnrevealed(location)) {
                    continue;
                }

                if (this.wholeEdge.isOnWeb(location)) {
                    continue;
                }

                candidateList.push(
                    new CandidateLocationDto(
                        location.y,
                        location.x,
                        this.probabilityDistribution.offEdgeProbability,
                        this.boardState.countAdjacentUnrevealed(location),
                        this.boardState.countAdjacentConfirmedFlags(location)
                    )
                );
            }
        }

        this.boardState.setAction = candidateList
            .sort(CandidateLocationDto.sortByProbabilityFreeFlag)
            .shift()
            .buildAction(this.getMoveMethod);
    }

    private pick(): void
    {
        const picked: LocationDto = this.allWitnessedSquares
            .getLocations
            .data
            .shift();

        this.boardState.setAction = new ActionDto(
            picked,
            ActionType.Clear,
            this.getMoveMethod,
            this.probabilityDistribution.getProbability(picked)
        );
    }

    private init(): void
    {
        const allWitnesses: LocationDto[] = this.boardState.getAllLivingWitnesses;
        this.allWitnessedSquares = this.boardState.getUnrevealedArea(allWitnesses);
    }
}
