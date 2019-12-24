import {AbstractStrategy, StrategyType} from './abstract-strategy';
import LocationDto from '../dto/location.dto';
import BoardStateDto from '../dto/board-state.dto';
import WitnessWebDto from '../dto/witness-web.dto';
import ActionDto, {ActionType} from '../dto/action.dto';

export default class TrivialSearchStrategy extends AbstractStrategy
{
    private readonly wholeEdge: WitnessWebDto;

    public constructor(boardState: BoardStateDto, wholeEdge: WitnessWebDto)
    {
        super(boardState);

        this.wholeEdge = wholeEdge;
    }

    protected applyStrategy()
    {
        this.wholeEdge.getPrunedWitnesses.forEach((location) => {
            if (! this.isObviousFlag(location)) {
                return;
            }

            this.markAdjacentLocations(location, ActionType.Flag);
        });

        this.wholeEdge.getPrunedWitnesses.forEach((location) => {
            if (! this.isObviousClear(location)) {
                return;
            }

            this.markAdjacentLocations(location, ActionType.Clear);
        });
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.TrivialSearch;
    }

    private isObviousClear(location: LocationDto): boolean
    {
        const tileValue: number = this.boardState.getWitnessValue(location);
        const flagsCount: number = this.boardState.countAdjacentConfirmedFlags(location);
        const unrevealedCount = this.boardState.countAdjacentUnrevealed(location);

        return tileValue === flagsCount
            && 0 < unrevealedCount;
    }

    private isObviousFlag(location: LocationDto): boolean
    {
        const tileValue: number = this.boardState.getWitnessValue(location);
        const flagsCount: number = this.boardState.countAdjacentConfirmedFlags(location);
        const unrevealedCount = this.boardState.countAdjacentUnrevealed(location);

        return tileValue === flagsCount + unrevealedCount
            && 0 < unrevealedCount;
    }

    private markAdjacentLocations(location: LocationDto, actionType: ActionType): void
    {
        for (const adjacentLocation of this.boardState.getAdjacentSquaresIterable(location)) {
            if (! this.boardState.isUnrevealed(adjacentLocation)) {
                continue;
            }

            if (! this.boardState.alreadyActioned(adjacentLocation)) {
                this.boardState.setAction = new ActionDto(adjacentLocation, actionType, this.getMoveMethod, 1);
            }
        }
    }
}
