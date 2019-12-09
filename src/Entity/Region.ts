import Coordinate from './Coordinate';
import Board from './Board';

export default class Region {
    private data: Coordinate[][] = [];
    private readonly bruteForceLimit: number;

    public constructor(bruteForceLimit: number = 8)
    {
        this.bruteForceLimit = bruteForceLimit;
    }

    public get(n: number): Coordinate[]
    {
        if (0 <= n && this.count > n) {
            return this.data[n];
        }

        throw Error();
    }

    public get count(): number
    {
        return this.data.length;
    }

    public segregate(board: Board): void
    {
        let emptyItems: Coordinate[] = board.listEmptyItems;
        let borderItems: Coordinate[] = board.listBorderItems;

        if (emptyItems.length - borderItems.length <= this.bruteForceLimit) {
            this.data.push(emptyItems);
        } else {
            this.data = Region.process(borderItems);
        }
    }

    private static process(borderItems: Coordinate[]): Coordinate[][]
    {

    }
}
