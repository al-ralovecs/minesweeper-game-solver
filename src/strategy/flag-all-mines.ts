import AbstractStrategy from './abstract-strategy';
import MarginDto from '../dto/margin.dto';

export class FlagAllMines extends AbstractStrategy
{
    apply()
    {
        for (let y: number = 0; y < this.board.height; y++) {
            for (let x: number = 0; x < this.board.width; x++) {

                if (1 > this.board.exposed[y][x]
                    || this.countUnrevealedTilesAround(y, x) !== this.board[y][x]
                ) {
                    continue;
                }

                const m: MarginDto = new MarginDto(y, x, this.board.height, this.board.width);

                for (let i: number = y + m.top; i <= y + m.bottom; i++) {
                    for (let j: number = x + m.left; j <= x + m.right; j++) {
                        if (i === y && j == x) {
                            continue;
                        }

                        if (-1 === this.board.exposed[i][j]) {
                            this.board.exposed[i][j] = 9;
                        }
                    }
                }
            }
        }
    }

    get hasSolution(): boolean
    {
        return false;
    }

    private countUnrevealedTilesAround(y: number, x: number): number
    {
        let count = 0;
        const m: MarginDto = new MarginDto(y, x, this.board.height, this.board.width);

        for (let i: number = y + m.top; i <= y + m.bottom; i++) {
            for (let j: number = x + m.left; j <= x + m.right; j++) {
                if (i === y && j === x) {
                    continue;
                }

                if (-1 === this.board.exposed[i][j]) {
                    count++;
                }
            }
        }

        return count;
    }
}
