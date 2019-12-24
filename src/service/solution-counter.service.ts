import ProbabilityEngineService from './probability-engine.service';

export default class SolutionCounterService extends ProbabilityEngineService
{
    private mineCounts: Map<number, bigint> = new Map<number, bigint>();

    public process(): void
    {
        if (! this.web.isWebValid) {
            this.getProbabilityDistribution.finalSolutionsCount = 0n;
            return;
        }

        this.generateBoxProbabilities();
        this.calculateBoxProbabilities();
    }

    protected calculateBoxProbabilities(): void
    {
        // total game tally
        let totalTally: bigint = 0n;

        // outside a box tally
        let outsideTally: bigint = 0n;

        let emptyBox: boolean[] = new Array<boolean>(this.data.boxCount).fill(true);

        for (const pl of this.heldProbs) {
            if (this.data.minTotalMines > pl.mineCount) {
                continue;
            }

            this.mineCounts.set(pl.mineCount, pl.solutionCount);

            // number of ways
            // the rest of the board can be formed
            let mult: bigint = this.binomial.getCombination(this.data.minesLeft - pl.mineCount, this.data.squaresLeft);

            outsideTally += mult * BigInt(this.data.minesLeft - pl.mineCount) * pl.solutionCount;

            totalTally += mult * pl.solutionCount;

            for (let i: number = 0; i < emptyBox.length; i++) {
                if (0 !== pl.mineCount[i]) {
                    emptyBox[i] = false;
                }
            }
        }

        // determine how many clear squares there are
        if (0 < totalTally) {
            for (let i: number = 0; i < emptyBox.length; i++) {
                if (emptyBox[i]) {
                    this.data.clearCount += this.data.boxes[i].getSquares.length;
                }
            }
        }

        this.data.finalSolutionsCount = totalTally;
    }
}
