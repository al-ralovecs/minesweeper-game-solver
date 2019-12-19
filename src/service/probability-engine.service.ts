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

    public constructor(boardState: BoardStateDto, web: WitnessWebDto, binomial: Binomial, squaresLeft: number, minesLeft: number, deadLocations: AreaDto)
    {
        this.boardState = boardState;
        this.web = web;
        this.binomial = binomial;
        
        this.minesLeft = minesLeft;
        this.squaresLeft = squaresLeft - web.getSquares.length;
        this.deadLocations = deadLocations;

        this.minTotalMines = this.minesLeft - this.squaresLeft;
        this.maxTotalMines = this.minesLeft;

        this.witnesses = this.web.getPrunedWitnesses;
        this.boxes = this.web.getBoxes;

        this.boxCount = this.boxes.length;

        this.boxProb = new Array<number>(this.boxCount);
        this.hashTally = new Array<bigint>(this.boxCount);

        for (const w of this.witnesses) {
            w.setProcessed = false;
        }

        for (const b of this.boxes) {
            b.setProcessed = false;
        }
    }

    public process(): void
    {
        let held: ProbabilityLineDto = new ProbabilityLineDto();
        held.solutionCount = 1n;
        this.heldProbs.push(held);

        this.workingProbs.push(new ProbabilityLineDto());

        this.mask = new Array<boolean>(this.boxCount);

        let witness: NextWitnessDto = this.findFirstWitness();

        while (null !== witness) {
            for (const b of witness.newBoxes) {
                this.mask[b.getUID] = true;
            }

            this.workingProbs = this.mergeProbabilitiesWithWitness(witness);

            witness = this.findNextWitness(witness);
        }

        this.calculateBoxProbabilities();
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
        prevWitness.witness.setProcessed = true;

        for (const b of prevWitness.newBoxes) {
            b.setProcessed = true;
        }

        let bestTodo: number = 99999;
        let bestWitness: WitnessDto = null;

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

        this.independentGroups++;

        const nw: NextWitnessDto = this.findFirstWitness();

        if (1 < this.workingProbs.length || null === nw) {
            this.storeProbabilities();

            this.workingProbs = [];
            this.workingProbs.push(new ProbabilityLineDto());

            this.mask = new Array<boolean>(this.boxCount);
        }

        return nw;
    }

    private storeProbabilities(): void
    {
        let result: ProbabilityLineDto[] = [];

        const crunched: ProbabilityLineDto[] = this.crunchByMineCount(this.workingProbs);

        for (const pl of crunched) {
            for (const epl of this.heldProbs) {
                let npl: ProbabilityLineDto = new ProbabilityLineDto();
                npl.mineCount = pl.mineCount + epl.mineCount;

                if (this.maxTotalMines < npl.mineCount) {
                    continue;
                }

                npl.solutionCount = pl.solutionCount * epl.solutionCount;

                for (let i: number = 0; i < npl.mineBoxCount.length; i++) {
                    let w1: bigint = pl.mineBoxCount[i] * epl.solutionCount;
                    let w2: bigint = epl.mineBoxCount[i] * pl.solutionCount;
                    npl.mineBoxCount[i] = w1 + w2;

                    npl.hashCount[i] = epl.hashCount[i] + pl.hashCount[i];
                }

                result.push(npl);
            }
        }

        result.sort(ProbabilityLineDto.sortByMineCount);

        this.heldProbs = [];

        if (0 === result.length) {
            return;
        }

        let mc: number = result[0].mineCount;
        let npl: ProbabilityLineDto = new ProbabilityLineDto();
        npl.mineCount = mc;

        for (const pl of result) {
            if (pl.mineCount !== mc) {
                this.heldProbs.push(npl);
                mc = pl.mineCount;
                npl = new ProbabilityLineDto();
                npl.mineCount = mc;
            }

            npl.solutionCount += pl.solutionCount;

            for (let i: number = 0; i < pl.mineBoxCount.length; i++) {
                npl.mineBoxCount[i] += pl.mineBoxCount[i];
                npl.hashCount[i] += pl.hashCount[i];
            }
        }

        this.heldProbs.push(npl);
    }

    private crunchByMineCount(target: ProbabilityLineDto[]): ProbabilityLineDto[]
    {
        if (0 === target.length) {
            return target;
        }

        target.sort(ProbabilityLineDto.sortByMineCount);

        let result: ProbabilityLineDto[] = [];

        let mc: number = target[0].mineCount;
        let npl: ProbabilityLineDto = new ProbabilityLineDto();
        npl.mineCount = mc;

        for (const pl of target) {
            if (pl.mineCount !== mc) {
                result.push(npl);
                mc = pl.mineCount;
                npl = new ProbabilityLineDto();
                npl.mineCount = mc;
            }

            this.mergeProbabilities(npl, pl);
        }

        result.push(npl);

        return result;
    }

    private mergeProbabilities(npl: ProbabilityLineDto, pl: ProbabilityLineDto): void
    {
        let solutions: bigint = 1n;

        for (let i: number = 0; i < pl.mineBoxCount.length; i++) {
            solutions *= BigInt(SmallCombinations[this.boxes[i].getSquares.length][pl.mineBoxCount[i]]);
        }

        npl.solutionCount +=solutions;

        for (let i: number = 0; i < pl.mineBoxCount.length; i++) {
            if (! this.mask[i]) {
                continue;
            }

            npl.mineBoxCount[i] += pl.mineBoxCount[i] * solutions;

            if (0n === pl.mineBoxCount[i]) {
                npl.hashCount[i] -= pl.hash * BigInt(this.boxes[i].getSquares.length);
            } else {
                npl.hashCount[i] += pl.mineBoxCount[i] * pl.hash;
            }
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
                for (const mm of this.distributeMissingMines(pl, nw, missingMines, 0)) {
                    newProbs.push(mm);
                }
            }
        }

        return newProbs;
    }

    private static countPlacedMines(pl: ProbabilityLineDto, nw: NextWitnessDto): number
    {
        let result: number = 0;

        for (const b of nw.oldBoxes) {
            result += Number(pl.mineBoxCount[b.getUID]);
        }

        return result;
    }

    private distributeMissingMines(pl: ProbabilityLineDto, nw: NextWitnessDto, missingMines: number, index: number): ProbabilityLineDto[]
    {
        this.recursions++;

        let result: ProbabilityLineDto[] = [];

        if (1 === nw.newBoxes.length - index) {
            if (missingMines > nw.newBoxes[index].getMaxMines) {
                return result;
            }

            if (missingMines < nw.newBoxes[index].getMinMines) {
                return result;
            }

            if (this.maxTotalMines < pl.mineCount + missingMines) {
                return result;
            }

            pl.mineBoxCount[nw.newBoxes[index].getUID] = BigInt(missingMines);
            pl.mineCount += missingMines;
            result.push(pl);

            return result;
        }

        let maxToPlace: number = Math.min(nw.newBoxes[index].getMaxMines, missingMines);

        for (let i: number = nw.newBoxes[index].getMinMines; i <= maxToPlace; i++) {
            let npl: ProbabilityLineDto = ProbabilityEngineService.extendProbabilityLine(pl, nw.newBoxes[index], i);

            for (const mm of this.distributeMissingMines(npl, nw, missingMines - i, index + 1)) {
                result.push(mm);
            }
        }

        return result;
    }

    private static extendProbabilityLine(pl: ProbabilityLineDto, newBox: BoxDto, mines: number): ProbabilityLineDto
    {
        let result: ProbabilityLineDto = new ProbabilityLineDto();

        result.mineCount = pl.mineCount + mines;
        result.mineBoxCount[newBox.getUID] = BigInt(mines);

        return result;
    }

    private calculateBoxProbabilities(): void
    {
        let tally: bigint[] = new Array<bigint>(this.boxCount);

        for (let i: number = 0; i < tally.length; i++) {
            tally[i] = 0n;
            this.hashTally[i] = 0n;
        }

        let totalTally: bigint = 0n;

        let outsideTally: bigint = 0n;

        for (const pl of this.heldProbs) {
            if (this.minTotalMines > pl.mineCount) {
                continue;
            }
            
            let mult: bigint = this.binomial.getCombination(this.minesLeft - pl.mineCount, this.squaresLeft);
            
            outsideTally += mult * BigInt(this.minesLeft - pl.mineCount) * pl.solutionCount;
            
            totalTally += mult * pl.solutionCount;
            
            for (let i: number = 0; i < tally.length; i++) {
                tally[i] += mult * (pl.mineBoxCount[i] / BigInt(this.boxes[i].getSquares.length));
                this.hashTally[i] += pl.hashCount[i];
            }
        }
        
        for (let i: number = 0; i < this.boxProb.length; i++) {
            if (0n !== totalTally) {
                if (0.01 >= Math.abs(Number(tally[i] - totalTally))) {
                    this.boxProb[i] = 0;
                    
                    for (const squ of this.boxes[i].getSquares) {
                        this.mines.push(squ);
                    }
                } else {
                    this.boxProb[i] = 1 - (tally[i] / totalTally);
                }
            } else {
                this.boxProb[i] = 0;
            }
        }
        
        for (let i: number = 0; i < this.hashTally.length; i++) {
            for (let j: number = i + 1; j < this.hashTally.length; j++) {
                const hash1: bigint = this.hashTally[i] / BigInt(this.boxes[i].getSquares.length);
                const hash2: bigint = this.hashTally[j] / BigInt(this.boxes[j].getSquares.length);
                
                if (0.01 >= Math.abs(Number(hash1 - hash2))) {
                    ProbabilityEngineService.addLinkedLocation(this.linkedLocations, this.boxes[i], this.boxes[j]);
                    ProbabilityEngineService.addLinkedLocation(this.linkedLocations, this.boxes[j], this.boxes[i]);
                }
                
                if (0.01 >= Math.abs(Number(hash1 + hash2))) {
                    ProbabilityEngineService.addLinkedLocation(this.contraLinkedLocations, this.boxes[i], this.boxes[j]);
                    ProbabilityEngineService.addLinkedLocation(this.contraLinkedLocations, this.boxes[j], this.boxes[i]);
                }
            }
        }
        
        this.linkedLocations.sort(LinkedLocationDto.sortByLinksDesc);
        
        if (0 !== this.squaresLeft && 0n !== totalTally) {
            this.offEdgeProbability = 1 - (outsideTally / totalTally / this.squaresLeft);
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