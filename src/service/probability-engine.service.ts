import ServiceInterface from '../interface/service.interface';

import BoardStateDto from '../dto/board-state.dto';
import WitnessWebDto from '../dto/witness-web.dto';
import Binomial from '../utility/binomial';

import WitnessDto from '../dto/witness.dto';
import BoxDto from '../dto/box.dto';
import AreaDto from '../dto/area.dto';
import NextWitnessDto from '../dto/next-witness.dto';
import ProbabilityLineDto from '../dto/probability-line.dto';
import LinkedLocationDto from '../dto/linked-location.dto';
import LocationDto from '../dto/location.dto';

import bigintDivide from '../routine/bigint.divide';

export const SmallCombinations = [
    [ 1 ],
    [ 1, 1 ],
    [ 1, 2, 1 ],
    [ 1, 3, 3, 1 ],
    [ 1, 4, 6, 4, 1 ],
    [ 1, 5, 10, 10, 5, 1 ],
    [ 1, 6, 15, 20, 15, 6, 1 ],
    [ 1, 7, 21, 35, 35, 21, 7, 1 ],
    [ 1, 8, 28, 56, 70, 56, 28, 8, 1 ]
];

export default class ProbabilityEngineService implements ServiceInterface
{
    public workingProbs: ProbabilityLineDto[] = [];
    public heldProbs: ProbabilityLineDto[] = [];

    public boxProb: number[];               //BigDecimal
    public hashTally: bigint[];
    public offEdgeBest: boolean = true;
    public offEdgeProbability: number;      //BigDecimal
    public bestProbability: number;         //BigDecimal
    public cutOffProbability: number;       //BigDecimal

    public mask: boolean[];

    public linkedLocations: LinkedLocationDto[] = [];
    public contraLinkedLocations: LinkedLocationDto[] = [];
    public mines: LocationDto[] = [];

    private boardState: BoardStateDto;
    private web: WitnessWebDto;
    private binomial: Binomial;
    
    private readonly boxCount: number;
    private readonly witnesses: WitnessDto[];
    private readonly boxes: BoxDto[];
    private readonly minesLeft: number;
    private readonly squaresLeft: number;
    private deadLocations: AreaDto;

    private independentGroups: number = 0;
    private recursions: number = 0;

    private finalSolutionsCount: bigint;

    private readonly minTotalMines: number;
    private readonly maxTotalMines: number;

    public constructor(
        boardState: BoardStateDto,
        web: WitnessWebDto,
        deadLocations: AreaDto,
        binomial: Binomial)
    {
        this.boardState = boardState;
        this.web = web;
        this.binomial = binomial;
        
        this.minesLeft = this.boardState.expectedTotalMines - this.boardState.getConfirmedFlagCount;
        this.squaresLeft = this.boardState.getTotalUnrevealedCount - web.getSquares.length;
        this.deadLocations = deadLocations;

        this.minTotalMines = this.minesLeft - this.squaresLeft;
        this.maxTotalMines = this.minesLeft;

        this.witnesses = this.web.getPrunedWitnesses;
        this.boxes = this.web.getBoxes;

        this.boxCount = this.boxes.length;

        this.boxProb = new Array<number>(this.boxCount);
        this.hashTally = new Array<bigint>(this.boxCount);
    }

    public process(): void
    {
        this.generateBoxProbabilities();
        this.calculateBoxProbabilities();
    }

    private generateBoxProbabilities(): void
    {
        // an array showing which boxes have been processed
        // this iteration - none have to start with
        this.mask = new Array<boolean>(this.boxCount).fill(false);

        // an initial solution of no mines anywhere
        let held: ProbabilityLineDto = new ProbabilityLineDto(this.boxCount);
        held.solutionCount = 1n;
        this.heldProbs.push(held);

        // an empty probability line
        // to get us started
        this.workingProbs.push(new ProbabilityLineDto(this.boxCount));

        let nextWitness: NextWitnessDto = this.findFirstWitness();

        while (null !== nextWitness) {

            // mark the new boxes as processed - which they will be soon
            for (const b of nextWitness.newBoxes) {
                this.mask[b.getUID] = true;
            }

            this.workingProbs = this.mergeProbabilitiesWithWitness(nextWitness);

            nextWitness = this.findNextWitness(nextWitness);
        }
    }

    private mergeProbabilitiesWithWitness(nw: NextWitnessDto): ProbabilityLineDto[]
    {
        let newProbs: ProbabilityLineDto[] = [];

        for (const pl of this.workingProbs) {
            let missingMines: number = nw.witness.getMines - ProbabilityEngineService.countPlacedMines(pl, nw);

            if (0 > missingMines) {
                // invalid
            } else if (0 === missingMines) {
                newProbs.push(pl);
            } else if (0 === nw.newBoxes.length) {
                // invalid
            } else {
                newProbs.push(...this.distributeMissingMines(pl, nw, missingMines, 0));
            }
        }

        return newProbs;
    }

    private distributeMissingMines(pl: ProbabilityLineDto, nw: NextWitnessDto, missingMines: number, index: number): ProbabilityLineDto[]
    {
        this.recursions++;

        let result: ProbabilityLineDto[] = [];

        // if there is only one box left to put the missing mines, then
        // we have reach the end of this branch of recursion
        if (1 === nw.newBoxes.length - index) {

            // if there are too many for this box
            // then the probability can't be valid
            if (missingMines > nw.newBoxes[index].getMaxMines) {
                return result;
            }

            // if there are too few for this box
            // then the probability can't be valid
            if (missingMines < nw.newBoxes[index].getMinMines) {
                return result;
            }

            // if there are too many for this game
            // then the probability can't be valid
            if (this.maxTotalMines < pl.mineCount + missingMines) {
                return result;
            }

            // otherwise
            // place the mines in the probability line
            pl.mineBoxCount[nw.newBoxes[index].getUID] = BigInt(missingMines);
            pl.mineCount = pl.mineCount + missingMines;
            result.push(pl);

            return result;
        }

        let maxToPlace: number = Math.min(nw.newBoxes[index].getMaxMines, missingMines);

        for (let i: number = nw.newBoxes[index].getMinMines; i <= maxToPlace; i++) {

            let npl: ProbabilityLineDto = this.extendProbabilityLine(pl, nw.newBoxes[index], i);

            result.push(...this.distributeMissingMines(npl, nw, missingMines - i, index + 1));
        }

        return result;
    }

    public get getOffEdgeProb(): number
    {
        return this.offEdgeProbability;
    }

    private findFirstWitness(): NextWitnessDto
    {
        for (const w of this.witnesses) {
            if (! w.isProcessed) {
                return new NextWitnessDto(w);
            }
        }

        return null;
    }

    private findNextWitness(prevWitness: NextWitnessDto): NextWitnessDto
    {
        // flag the last set of details as processed
        prevWitness.witness.setProcessed = true;

        for (const b of prevWitness.newBoxes) {
            b.setProcessed = true;
        }

        let bestTodo: number = 99999;
        let bestWitness: WitnessDto = null;

        // and find a witness
        // which is on the boundary
        // of what has already been processed
        for (const b of this.boxes) {
            if (! b.isProcessed) {
                continue;
            }

            for (const w of b.getWitnesses) {
                if (w.isProcessed) {
                    continue;
                }

                let todo: number = 0;

                for (const b1 of w.getBoxes) {
                    if (b1.isProcessed) {
                        continue;
                    }

                    todo++;
                }

                // prioritise the witnesses
                // which have the least boxes left to process
                if (0 === todo) {
                    return new NextWitnessDto(w);
                }

                if (todo < bestTodo) {
                    bestTodo = todo;
                    bestWitness = w;
                }
            }
        }

        if (null !== bestWitness) {
            return new NextWitnessDto(bestWitness);
        }

        // if we are down here
        // then there is no witness which is on the boundary,
        // so we have processed a complete set of independent witnesses

        /**
         * @note: this is exactly the place where we can find (local) clears
         */

        this.independentGroups++;

        const nw: NextWitnessDto = this.findFirstWitness();

        // only crunch it down for non-trivial probability lines unless it is the last set
        // this is an efficiency decision
        if (2 < this.workingProbs.length || null === nw) {
            this.storeProbabilities();

            // reset the working array
            // so we can start building up one
            // for the new set of witnesses
            this.workingProbs = [];
            this.workingProbs.push(new ProbabilityLineDto(this.boxCount));

            this.mask = new Array<boolean>(this.boxCount).fill(false);
        }

        // return the next witness to process
        return nw;
    }

    // this combines newly generated probabilities
    // with ones we have already stored
    // from other independent sets of witnesses
    private storeProbabilities(): void
    {
        if (0 === this.workingProbs.length) {
            return;
        }

        let result: ProbabilityLineDto[] = [];

        // crunch the new ones down to one line per mine count
        const crunched: ProbabilityLineDto[] = this.crunchByMineCount(this.workingProbs);

        for (const pl of crunched) {
            for (const epl of this.heldProbs) {
                let npl: ProbabilityLineDto = new ProbabilityLineDto(this.boxCount);
                npl.mineCount = pl.mineCount + epl.mineCount;

                if (this.maxTotalMines < npl.mineCount) {
                    continue;
                }

                npl.solutionCount = pl.solutionCount * epl.solutionCount;

                for (let i: number = 0; i < npl.mineBoxCount.length; i++) {

                    const w1: bigint = pl.mineBoxCount[i] * epl.solutionCount;
                    const w2: bigint = epl.mineBoxCount[i] * pl.solutionCount;
                    npl.mineBoxCount[i] = w1 + w2;

                    //npl.hashCount[i] = epl.hashCount[i] + pl.hashCount[i];
                }

                result.push(npl);
            }
        }

        // sort into mine order
        result.sort(ProbabilityLineDto.sortByMineCount);

        this.heldProbs = [];

        if (0 === result.length) {
            return;
        }

        let mc: number = result[0].mineCount;
        let npl: ProbabilityLineDto = new ProbabilityLineDto(this.boxCount);
        npl.mineCount = mc;

        for (const pl of result) {
            if (pl.mineCount !== mc) {
                this.heldProbs.push(npl);
                mc = pl.mineCount;
                npl = new ProbabilityLineDto(this.boxCount);
                npl.mineCount = mc;
            }

            npl.solutionCount = npl.solutionCount + pl.solutionCount;

            for (let i: number = 0; i < pl.mineBoxCount.length; i++) {
                npl.mineBoxCount[i] = npl.mineBoxCount[i] + pl.mineBoxCount[i];
                //npl.hashCount[i] = npl.hashCount[i] + pl.hashCount[i];
            }
        }

        this.heldProbs.push(npl);
    }

    private crunchByMineCount(target: ProbabilityLineDto[]): ProbabilityLineDto[]
    {
        if (0 === target.length) {
            return target;
        }

        // sort the solutions by number of mines
        target.sort(ProbabilityLineDto.sortByMineCount);

        let result: ProbabilityLineDto[] = [];

        let mc: number = target[0].mineCount;
        let npl: ProbabilityLineDto = new ProbabilityLineDto(this.boxCount);
        npl.mineCount = mc;

        for (const pl of target) {
            if (pl.mineCount !== mc) {
                result.push(npl);
                mc = pl.mineCount;
                npl = new ProbabilityLineDto(this.boxCount);
                npl.mineCount = mc;
            }

            this.mergeProbabilities(npl, pl);
        }

        result.push(npl);

        return result;
    }

    // calculate how many ways this solution can be generated
    // and roll them into one
    private mergeProbabilities(npl: ProbabilityLineDto, pl: ProbabilityLineDto): void
    {
        let solutions: bigint = 1n;

        for (let i: number = 0; i < pl.mineBoxCount.length; i++) {
            solutions = solutions * BigInt(
                SmallCombinations[ this.boxes[i].getSquares.length ][ Number(pl.mineBoxCount[i]) ]
            );
        }

        npl.solutionCount +=solutions;

        for (let i: number = 0; i < pl.mineBoxCount.length; i++) {
            if (! this.mask[i]) {
                continue;
            }

            npl.mineBoxCount[i] = npl.mineBoxCount[i] + pl.mineBoxCount[i] * solutions;

            if (0n === pl.mineBoxCount[i]) {
                npl.hashCount[i] -= pl.hash * this.boxes[i].getSquares.length;
            } else {
                npl.hashCount[i] = npl.hashCount[i] + Number(pl.mineBoxCount[i]) * pl.hash;
            }
        }
    }

    private static countPlacedMines(pl: ProbabilityLineDto, nw: NextWitnessDto): number
    {
        let result: bigint = 0n;

        for (const b of nw.oldBoxes) {
            result += pl.mineBoxCount[b.getUID];
        }

        return Number(result);
    }

    // create a new probability line
    // by taking the old and adding the mines to the new Box
    private extendProbabilityLine(pl: ProbabilityLineDto, newBox: BoxDto, mines: number): ProbabilityLineDto
    {
        let result: ProbabilityLineDto = new ProbabilityLineDto(this.boxCount);

        result.mineCount = pl.mineCount + mines;

        // copy the probability array
        result.mineBoxCount = pl.mineBoxCount.slice();
        result.mineBoxCount[newBox.getUID] = BigInt(mines);

        return result;
    }

    // here we expand the localised solution to one across the whole board and
    // sum them together to create a definitive probability for each box
    private calculateBoxProbabilities(): void
    {
        let tally: bigint[] = new Array<bigint>(this.boxCount);

        for (let i: number = 0; i < tally.length; i++) {
            tally[i] = 0n;
            //this.hashTally[i] = 0n;
        }

        // total game tally
        let totalTally: bigint = 0n;

        // outside a box tally
        let outsideTally: bigint = 0n;

        for (const pl of this.heldProbs) {
            if (this.minTotalMines > pl.mineCount) {
                continue;
            }

            // number of ways
            // the rest of the board can be formed
            let mult: bigint = this.binomial.getCombination(this.minesLeft - pl.mineCount, this.squaresLeft);
            
            outsideTally += mult * BigInt(this.minesLeft - pl.mineCount) * pl.solutionCount;
            
            totalTally += mult * pl.solutionCount;
            
            for (let i: number = 0; i < tally.length; i++) {
                tally[i] += mult * pl.mineBoxCount[i] / BigInt(this.boxes[i].getSquares.length);
                //this.hashTally[i] += BigInt(pl.hashCount[i]);
            }
        }
        
        for (let i: number = 0; i < this.boxProb.length; i++) {
            if (0n !== totalTally) {

                // a mine
                if (tally[i] === totalTally) {
                    this.boxProb[i] = 0;
                    
                    for (const squ of this.boxes[i].getSquares) {
                        this.mines.push(squ);
                    }
                } else {
                    this.boxProb[i] = 1 - bigintDivide(tally[i], totalTally, 6);
                }
            } else {
                this.boxProb[i] = 0;
            }

            /**
             * @note: we can set individual probability for a tile here
             */
        }

        // for (let i: number = 0; i < this.hashTally.length; i++) {
        //     for (let j: number = i + 1; j < this.hashTally.length; j++) {
        //         const hash1: bigint = this.hashTally[i] / BigInt(this.boxes[i].getSquares.length);
        //         const hash2: bigint = this.hashTally[j] / BigInt(this.boxes[j].getSquares.length);
        //
        //         if (0.01 >= Math.abs(Number(hash1 - hash2))) {
        //             ProbabilityEngineService.addLinkedLocation(this.linkedLocations, this.boxes[i], this.boxes[j]);
        //             ProbabilityEngineService.addLinkedLocation(this.linkedLocations, this.boxes[j], this.boxes[i]);
        //         }
        //
        //         if (0.01 >= Math.abs(Number(hash1 + hash2))) {
        //             ProbabilityEngineService.addLinkedLocation(this.contraLinkedLocations, this.boxes[i], this.boxes[j]);
        //             ProbabilityEngineService.addLinkedLocation(this.contraLinkedLocations, this.boxes[j], this.boxes[i]);
        //         }
        //     }
        // }
        
        this.linkedLocations.sort(LinkedLocationDto.sortByLinksDesc);
        
        if (0 !== this.squaresLeft && 0n !== totalTally) {
            this.offEdgeProbability = 1 - bigintDivide(outsideTally, totalTally * BigInt(this.squaresLeft), 6);
        } else {
            this.offEdgeProbability = 0;
        }
        
        this.finalSolutionsCount = totalTally;
        
        let hwm: number = this.offEdgeProbability;
        
        this.offEdgeBest = true;
        
        for (const b of this.boxes) {
            let living: boolean = false;
            
            for (const squ of b.getSquares) {
                if (this.deadLocations.contains(squ)) {
                    continue;
                }
                
                living = true;
                break;
            }
            
            let prob: number = this.boxProb[b.getUID];
            
            if (living || 0.01 >= Math.abs(prob - 1)) {
                if (hwm - prob <= 0) {
                    this.offEdgeBest = false;
                    hwm = prob;
                }
            }
        }
        
        this.bestProbability = hwm;
        
        if (0.01 >= Math.abs(this.bestProbability - 1)) {
            this.cutOffProbability = 1;
        } else {
            this.cutOffProbability = this.bestProbability * 0.96;
        }
    }
    
    private static addLinkedLocation(list: LinkedLocationDto[], box: BoxDto, linkTo: BoxDto): void
    {
        top:
        for (const s of box.getSquares) {
            for (const ll of list) {
                if (s.equals(ll)) {
                    ll.incrementLinks(linkTo.getSquares);
                    continue top;
                }
            }
            
            list.push(new LinkedLocationDto(s.y, s.x, linkTo.getSquares));
        }
    }
}

/**

 */