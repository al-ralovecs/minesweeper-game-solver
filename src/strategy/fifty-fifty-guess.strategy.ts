import { AbstractStrategy, StrategyType } from './abstract-strategy';
import LocationDto from '../dto/location.dto';
import ActionDto, { ActionType } from '../dto/action.dto';
import isCoordinatesValid from '../routine/coordinate.is-valid';

export default class FiftyFiftyGuessStrategy extends AbstractStrategy
{
    apply()
    {
        const assumedMoveProbability: number = 0.5; // Not calculated given entire board, therefore, just an assumption

        for (let i: number = 0; i < this.boardState.width - 1; i++) {
            for (let j: number = 0; j < this.boardState.height; j++) {
                if (! this.isTileHidden(i, j) || ! this.isTileHidden(i + 1, j)) {
                    continue;
                }

                if (this.isPotentialInfo(i - 1, j - 1)
                    || this.isPotentialInfo(i - 1, j)
                    || this.isPotentialInfo(i - 1, j + 1)
                    || this.isPotentialInfo(i + 2, j - 1)
                    || this.isPotentialInfo(i + 2, j)
                    || this.isPotentialInfo(i + 2, j + 1)
                ) {
                    continue;
                }

                if (this.isOnlyOne(i, j - 1)
                    || this.isOnlyOne(i + 1, j - 1)
                    || this.isOnlyOne(i, j + 1)
                    || this.isOnlyOne(i + 1, j + 1)
                ) {
                    this.boardState.setAction = new ActionDto(
                        new LocationDto(j, i),
                        ActionType.Clear,
                        StrategyType.FiftyFiftyGuess,
                        assumedMoveProbability
                    );
                }
            }
        }

        for (let i: number = 0; i < this.boardState.width; i++) {
            for (let j: number = 0; j < this.boardState.height - 1; j++) {
                if (! this.isTileHidden(i, j) || ! this.isTileHidden(i, j + 1)) {
                    continue;
                }

                if (this.isPotentialInfo(i - 1, j - 1)
                    || this.isPotentialInfo(i, j - 1)
                    || this.isPotentialInfo(i + 1, j - 1)
                    || this.isPotentialInfo(i - 1, j + 2)
                    || this.isPotentialInfo(i, j + 2)
                    || this.isPotentialInfo(i + 1, j + 2)
                ) {
                    continue;
                }

                if (this.isOnlyOne(i - 1, j)
                    || this.isOnlyOne(i + 1, j)
                    || this.isOnlyOne(i - 1, j + 1)
                    || this.isOnlyOne(i + 1, j + 1)
                ) {
                    this.boardState.setAction = new ActionDto(
                        new LocationDto(j, i),
                        ActionType.Clear,
                        StrategyType.FiftyFiftyGuess,
                        assumedMoveProbability
                    );
                }
            }
        }
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.FiftyFiftyGuess;
    }

    private isTileHidden(x: number, y: number): boolean
    {
        return -1 === this.boardState.board[y][x];
    }

    private isPotentialInfo(x: number, y: number): boolean
    {
        if (! isCoordinatesValid(y, x, this.boardState.height, this.boardState.width)) {
            return false;
        }

        return ! this.boardState.isConfirmedFlag(new LocationDto(y, x));
    }

    private isOnlyOne(x: number, y: number): boolean
    {
        if (! isCoordinatesValid(y, x, this.boardState.height, this.boardState.width)) {
            return false;
        }

        return 1 === this.boardState.board[y][x] - this.boardState.countAdjacentConfirmedFlags(new LocationDto(y, x));
    }
}
