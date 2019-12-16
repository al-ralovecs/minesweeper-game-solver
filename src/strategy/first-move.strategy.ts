import { AbstractStrategy, StrategyType } from "./abstract-strategy";
import LocationDto from "../dto/location.dto";

export default class FirstMoveStrategy extends AbstractStrategy
{
    public readonly name: StrategyType = StrategyType.FirstMove;

    apply(): void
    {
        const totalTilesCount: number = this.boardState.height * this.boardState.width;

        if (this.boardState.getTotalUnrevealedCount !== totalTilesCount) {
            return;
        }

        const y: number = Math.round(this.boardState.height / 2) - 1;
        const x: number = Math.round(this.boardState.width / 2) - 1;

        if (0 > y || 0 > x || this.boardState.height <= y || this.boardState.width <= x) {
            throw Error(`[FirstMoveStrategy] Proposed first move (${x}, ${y}) is out of board`);
        }

        this.solution = new LocationDto(y, x);
        this.isHasSolution = true;
    }
}
