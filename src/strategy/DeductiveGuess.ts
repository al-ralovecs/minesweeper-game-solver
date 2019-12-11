import Board from '../Entity/Board';
import Coordinate from '../Entity/Coordinate';
import RegionList from '../Entity/RegionList';
import SolutionList from '../Entity/SolutionList';

export default class DeductiveGuess {
    private board: Board;

    private regionCount: number;

    private solutions: SolutionList;
    private solution: Coordinate;

    private sProbability: number = 0;

    private bruteForceLimit: number;

    public constructor(bruteForceLimit: number = 8, previouslyAnalyzedRegionCount: number = 0)
    {
        this.bruteForceLimit = bruteForceLimit;
        this.regionCount = previouslyAnalyzedRegionCount;
    }

    public get getSolutionCoordinate(): Coordinate
    {
        return this.solution;
    }

    public get getSolutionList(): SolutionList
    {
        return this.solutions;
    }

    public hasSolution(board: Board): boolean
    {
        const regionList = new RegionList(this.bruteForceLimit);

        if (this.regionCount === regionList.count) {
            return false;
        }

        this.regionCount = regionList.count;

        regionList.segregate(board);

        for (let s: number = 0; s < regionList.count; s++) {
            this.board = board;

            this.processRecursively(regionList.item(s), 0);

            if (0 === this.solutions.count) {
                return false;
            }

            if (this.solutions.exists) {
                this.solution = regionList.item(s)[this.solutions.index];

                break;
            }

            let currentBestProbability: number = this.solutions.getHighestEmptyItemProbability;

            if (currentBestProbability > this.sProbability) {
                this.sProbability = currentBestProbability;
                this.solution = regionList.item(s)[this.solutions.index];
            }

            this.solutions.aggregateStatistics();
        }

        return this.solutions.exists;
    }

    private processRecursively(borderItems: Coordinate[], depth: number): void
    {
        if(typeof this.board === 'undefined') {
            return;
        }

        if (! this.board.isConsistent) {
            return;
        }

        if (borderItems.length === depth) {
            let solution: boolean[] = [];

            for (let i: number = 0; i < borderItems.length; i++) {
                solution[i] = this.board.getMinesMap.getIsFlag(borderItems[i].y, borderItems[i].x);
            }

            this.solutions.add(solution);
            return;
        }

        let itemUnderInvestigation: Coordinate = borderItems[depth];

        this.board.getMinesMap.setIsFlag(itemUnderInvestigation.y, itemUnderInvestigation.x, true);
        this.processRecursively(borderItems, depth + 1);
        this.board.getMinesMap.setIsFlag(itemUnderInvestigation.y, itemUnderInvestigation.x, false);

        this.board.getEmptyMap.setIsFlag(itemUnderInvestigation.y, itemUnderInvestigation.x, true);
        this.processRecursively(borderItems, depth + 1);
        this.board.getEmptyMap.setIsFlag(itemUnderInvestigation.y, itemUnderInvestigation.x, false);
    }
}
