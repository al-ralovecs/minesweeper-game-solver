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
        let count: number = 0;

        for (const location of this.wholeEdge.getPrunedWitnesses) {
            if (this.isObviousFlag(location)) {
                for (const l of this.boardState.getAdjacentSquaresIterable(location)) {
                    if (this.boardState.isUnrevealed(l)) {
                        if (! this.boardState.alreadyActioned(l)) {
                            count++;
                            this.boardState.setAction = new ActionDto(l, ActionType.Flag, StrategyType.TrivialSearch, 1);
                        }
                    }
                }
            }
        }

        for (const location of this.wholeEdge.getPrunedWitnesses) {
            if (this.isObviousClear(location)) {
                for (const l of this.boardState.getAdjacentSquaresIterable(location)) {
                    if (this.boardState.isUnrevealed(l)) {
                        if (! this.boardState.alreadyActioned(l)) {
                            count++;
                            this.boardState.setAction = new ActionDto(l, ActionType.Clear, StrategyType.TrivialSearch, 1);
                        }
                    }
                }
            }
        }
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.TrivialSearch;
    }

    private isObviousClear(location: LocationDto): boolean
    {
        const flags: number = this.boardState.countAdjacentConfirmedFlags(location);

        return this.boardState.getWitnessValue(location) === flags
            && 0 < this.boardState.countAdjacentUnrevealed(location);
    }

    private isObviousFlag(location: LocationDto): boolean
    {
        const flags: number = this.boardState.countAdjacentConfirmedFlags(location);
        const free = this.boardState.countAdjacentUnrevealed(location);

        return this.boardState.getWitnessValue(location) === flags + free && 0 < free;
    }
}