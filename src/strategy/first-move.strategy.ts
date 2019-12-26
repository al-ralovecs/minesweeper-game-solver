import { AbstractStrategy, StrategyType } from './abstract-strategy';
import LocationDto from '../dto/location.dto';
import ActionDto, { ActionType } from '../dto/action.dto';

export default class FirstMoveStrategy extends AbstractStrategy {
    protected get isStrategyApplicable(): boolean {
        return this.boardState.getTotalUnrevealedCount === this.boardState.height * this.boardState.width;
    }

    protected applyStrategy(): void {
        const y: number = Math.round(this.boardState.height / 2) - 1;
        const x: number = Math.round(this.boardState.width / 2) - 1;

        if (0 > y || 0 > x || this.boardState.height <= y || this.boardState.width <= x) {
            throw Error(`[FirstMoveStrategy] Proposed first move (${x}, ${y}) is out of board bounds`);
        }

        this.boardState.setAction = new ActionDto(
            new LocationDto(y, x),
            ActionType.Clear,
            StrategyType.FirstMove,
            1,
        );
    }

    protected get getMoveMethod(): StrategyType {
        return StrategyType.FirstMove;
    }
}
