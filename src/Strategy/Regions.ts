import Board from '../Entity/Board';
import Coordinate from '../Entity/Coordinate';

export default class Regions {
    private readonly board: Board;
    private readonly bruteForceLimit: number;

    private data: Coordinate[][] = [];

    public constructor(board: Board, bruteForceLimit: number = 8)
    {
        this.board = board;
        this.bruteForceLimit = bruteForceLimit;
    }

    public get list(): Coordinate[][]
    {
        return this.data;
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

    public segregate(): void
    {

    }

    private doSegregate(tiles: Coordinate[]): Coordinate[][]
    {
        let allRegions: Coordinate[][] = [];
        let covered: Coordinate[] = [];

        while (true) {
            let queue: Coordinate[] = [];
            let finishedRegion: Coordinate[] = [];

            for (let t = 0; t < tiles.length; t++) {
                if (0 === covered.filter(e => e.value === tiles[t].value).length) {
                    queue.push(tiles[t]);
                    break;
                }
            }

            if (0 === queue.length) {
                break;
            }

            while (0 !== queue.length) {
                const currentTile: Coordinate = queue.pop();
                const ci: number = currentTile.getFirst;
                const cj: number = currentTile.getSecond;

                finishedRegion.push(currentTile);
                covered.push(currentTile);

                for (let t = 0; t < tiles.length; t++) {
                    const tile: Coordinate = tiles[t];
                    const ti: number = tile.getFirst;
                    const tj: number = tile.getSecond;

                    let isConnected: boolean = false;

                    if (0 !== finishedRegion.filter(e => e.value === tile.value).length) {
                        continue;
                    }

                    if (Math.abs(ci - ti) <= 2 || Math.abs(cj - tj) <= 2) {
                        tileSearch:
                        for (let i: number = 0; i < this.board.height; i++) {
                            for (let j: number = 0; j < this.board.width; j++) {
                                if (this.board.getValue(i, j) > 0) {
                                    if (Math.abs(ci - i) <= 1
                                        && Math.abs(cj - j) <= 1
                                        && Math.abs(ti -i) <= 1
                                        && Math.abs(tj - j) <= 1
                                    ) {
                                        isConnected = true;
                                        break tileSearch;
                                    }
                                }
                            }
                        }

                        if (! isConnected) {
                            continue;
                        }

                        if (0 === queue.filter(e => e.value === tile.value).length) {
                            queue.push(tile);
                        }
                    }
                }
            }

            allRegions.push(finishedRegion);
        }

        return allRegions;
    }

    private get getAllEmptyTiles() {
        let result: Coordinate[] = [];

        for (let i = 0; i < this.board.height; i++) {
            for (let j = 0; j < this.board.width; j++) {
                if (this.board.getValue(i, j) === -1 && ! this.board.isMine(i, j)) {
                    result.push(new Coordinate(i, j));
                }
            }
        }

        return result;
    }

    private get getBorderTiles() {

    }
}
