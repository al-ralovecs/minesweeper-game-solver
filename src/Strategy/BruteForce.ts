import Board from '../Entity/Board';
import Coordinate from '../Entity/Coordinate';
import Regions from './Regions';

export default class BruteForce {
    private readonly board: Board;

    private wBoard: Board;
    private solutions: boolean[][];

    public constructor(board: Board)
    {
        this.board = board;
        this.solutions = [];
    }

    public getNextMove(): Coordinate
    {
        const startAt: Date = new Date();
        const segregatedRegions = new Regions(this.board);

        segregatedRegions.segregate();

        let totalCases: number = 1;
        let success: boolean = false;
        let bestProbability: number = 0;
        let probablyBestTile: number = -1;
        let probablyBestStep: number = -1;

        for (let s: number = 0; s < segregatedRegions.count; s++) {
            this.wBoard = this.board;

            this.trySolveRecursively(segregatedRegions.get(s), 0);




        }
    }

    private trySolveRecursively(tiles: Coordinate[], depth: number): void
    {
        if (! this.wBoard.isConsistent) {
            return;
        }

        if (tiles.length === depth) {
            let solution: boolean[] = [];

            for (let i: number = 0; i < tiles.length; i++) {
                solution[i] = this.wBoard.isMine(tiles[i].getFirst, tiles[i].getSecond);
            }

            this.solutions.push(solution);
            return;
        }

        let tile: Coordinate = tiles[depth];
        let y: number = tile.getFirst;
        let x: number = tile.getSecond;

        this.wBoard.setIsMine(y, x, true);
        this.trySolveRecursively(tiles, depth + 1);
        this.wBoard.setIsMine(y, x, false);

        this.wBoard.setIsEmpty(y, x, true);
        this.trySolveRecursively(tiles, depth + 1);
        this.wBoard.setIsEmpty(y, x, false);
    }
}
