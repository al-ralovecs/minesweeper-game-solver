export default class Board {
    private readonly state: number[][];
    private flags: boolean[][];

    private height: number;
    private width: number;

    public constructor(state: number[][])
    {
        if (! Board.validate(state)) {
            throw Error();
        }

        this.state = state;

        this.flagMines();
    }

    public get getHeight(): number
    {
        if (typeof this.height === 'undefined') {
            this.height = this.state.length;
        }

        return this.height;
    }

    public get getWidth(): number
    {
        if (typeof this.width === 'undefined') {
            this.width = this.state[0].length;
        }

        return this.width;
    }

    public getValue(y: number, x: number): number
    {
        if ( y >= 0 && y < this.getHeight && x >= 0 && x < this.getWidth) {
            return this.state[y][x];
        }

        return -10;
    }

    public getSurroundingFreeSquaresCount(y: number, x: number): number
    {
        let result = 0;

        if (this.getValue(y-1, x) === -1) {
            result++;
        }
        if (this.getValue(y+1, x) === -1) {
            result++;
        }
        if (this.getValue(y, x-1) === -1) {
            result++;
        }
        if (this.getValue(y, x+1) === -1) {
            result++;
        }
        if (this.getValue(y-1, x-1) === -1) {
            result++;
        }
        if (this.getValue(y-1, x+1) === -1) {
            result++;
        }
        if (this.getValue(y+1, x-1) === -1) {
            result++;
        }
        if (this.getValue(y+1, x+1) === -1) {
            result++;
        }

        return result;
    }

    public isBoundary(y: number, x: number): boolean
    {
        if (this.getValue(y, x) !== -1) {
            return false;
        }

        const
            oU: boolean = y === 0,
            oD: boolean = y === (this.getHeight - 1),
            oL: boolean = x === 0,
            oR: boolean = x === (this.getWidth - 1);

        if (!oU && this.getValue(y - 1, x) >= 0) {
            return true;
        }
        if (!oL && this.getValue(y, x - 1) >= 0) {
            return true;
        }
        if (!oD && this.getValue(y + 1, x) >= 0) {
            return true;
        }
        if (!oR && this.getValue(y, x + 1) >= 0) {
            return true;
        }
        if (!oU && !oL && this.getValue(y - 1, x - 1) >= 0) {
            return true;
        }
        if (!oU && !oR && this.getValue(y - 1, x + 1) >= 0) {
            return true;
        }
        if (!oD && !oL && this.getValue(y + 1, x - 1) >= 0) {
            return true;
        }

        return !oD && !oR && this.getValue(y + 1, x + 1) >= 0;
    }

    public hasMine(y: number, x: number): boolean
    {
        if (y >= 0 && y < this.getHeight && x >= 0 && x < this.getWidth) {
            return this.flags[y][x];
        }

        throw Error();
    }

    private flagMines(): void
    {
        let flags: boolean[][] = [];

        for (let i = 0; i < this.getHeight; i++) {
            let row: boolean[] = [];
            for (let j = 0; j < this.getWidth; j++) {
                row.push(false);
            }
            flags.push(row);
        }

        for (let i: number = 0; i < this.height; i++) {
            for (let j: number = 0; j < this.width; j++) {
                let currentValue: number = this.getValue(i, j);

                if (currentValue < 1 || currentValue !== this.getSurroundingFreeSquaresCount(i, j)) {
                    continue;
                }

                for (let ii: number = 0; ii < this.getHeight; ii++) {
                    for (let jj:number = 0; jj < this.getWidth; jj++) {
                        if (Math.abs(ii-i) <= 1 && Math.abs(jj-j) <= 1) {
                            if (this.getValue(ii, jj) === -1 && ! flags[ii][jj]) {
                                flags[ii][jj] = true;
                            }
                        }
                    }
                }
            }
        }

        this.flags = flags;
    }

    private static validate(state: number[][]): boolean
    {
        let width: number = 0;
        for (let i = 0; i < state.length; i++) {
            if (0 === width) {
                width = state[i].length;
                continue;
            }

            if (state[i].length === width) {
                continue;
            }

            return false;
        }

        return true;
    }
}
