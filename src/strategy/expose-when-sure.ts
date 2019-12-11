import AbstractStrategy from './abstract-strategy';
import CoordinateDto from '../dto/coordinate.dto';
import MarginDto from '../dto/margin.dto';

export default class ExposeWhenSure extends AbstractStrategy
{
    apply(): void
    {
        for (let y: number = 0; y < this.board.height; y++) {
            for (let x: number = 0; x < this.board.width; x++) {
                this.assessBoardTile(y, x);

                if (0 < this.board.exposed[y][x]
                    && 0 !== this.board.unexposed[y][x]
                    && this.board.exposed[y][x] === this.board.mines[y][x]
                ) {
                    const m: MarginDto = new MarginDto(y, x, this.board.height, this.board.width);

                    for (let i: number = y + m.top; i < y + m.bottom; i++) {
                        for (let j: number = x + m.left; j < x + m.right; j++) {
                            if (this.canExposeTile(i, j)) {
                                this.solution = new CoordinateDto(y, x);
                                this.hasSolution = true;

                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    private assessBoardTile(y: number, x: number): void
    {
        const m = new MarginDto(y, x, this.board.height, this.board.width);

        for (let i: number = y + m.top; i < y + m.bottom; i++) {
            for (let j: number = x + m.left; j < x + m.rigth; j++) {
                if (y === i && x === j) {
                    continue;
                }

                if (9 === this.board.exposed[i][j]) {
                    this.board.mines[y][x]++;
                } else if (0 > this.board.exposed[i][j]) {
                    this.board.unexposed[y][x]++;
                } else {
                    this.board.neighbors[y][x]++;
                }
            }
        }

        if (0 < this.board.exposed[y][x] && 9 > this.board.exposed[y][x]) {
            this.board.needed[y][x] = this.board.exposed[y][x] - this.board.mines[y][x];
        }
    }

    private canExposeTile(y, x): boolean
    {
        return this.board.exposed[y][x] < 0;
    }
}
