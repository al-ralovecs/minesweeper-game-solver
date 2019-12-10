import Coordinate from './Coordinate';
import Board from './Board';
import listEmptyItems from '../Routine/region.board.listEmptyItems';
import listBorderItems from '../Routine/region.board.listBorderItems';
import segregate from '../Routine/region.borderItems.segregate';

export default class RegionList {
    private data: Coordinate[][] = [];
    private readonly bruteForceLimit: number;

    public constructor(bruteForceLimit: number = 8)
    {
        this.bruteForceLimit = bruteForceLimit;
    }

    public get all(): Coordinate[][]
    {
        return this.data;
    }

    public item(n: number): Coordinate[]
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
        let emptyItems: Coordinate[] = listEmptyItems(board);
        let borderItems: Coordinate[] = listBorderItems(board);

        if (emptyItems.length - borderItems.length <= this.bruteForceLimit) {
            this.data.push(emptyItems);
        } else {
            this.data = segregate(borderItems, board);
        }
    }
}
