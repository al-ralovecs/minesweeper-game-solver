import AreaDto from './area.dto';
import BoxDto from './box.dto';
import LinkedLocationDto from './linked-location.dto';
import LocationDto from './location.dto';
import WitnessDto from './witness.dto';
import CandidateLocationDto from "./candidate-location.dto";

export const PROBABILITY_ENGINE_TOLERANCE: number = 0.96;

export default class ProbabilityDistributionDto
{
    public readonly boxes: BoxDto[];
    public readonly boxCount: number;
    public readonly witnesses: WitnessDto[];

    public boxProb: number[];

    public hashTally: bigint[];

    public minesLeft: number;
    public squaresLeft: number;
    public deadLocations: AreaDto;

    public readonly minTotalMines: number;
    public readonly maxTotalMines: number;
    public mines: LocationDto[] = [];

    public offEdgeBest: boolean = true;
    public offEdgeProbability: number;
    public bestProbability: number;
    public cutOffProbability: number;
    public bestCandidates: CandidateLocationDto[];

    public finalSolutionsCount: bigint;
    public clearCount: number;

    public linkedLocations: LinkedLocationDto[] = [];
    public contraLinkedLocations: LinkedLocationDto[] = [];

    public constructor(
        boxes: BoxDto[],
        witnesses: WitnessDto[],
        minesLeft: number,
        squaresLeft: number,
        deadLocations: AreaDto
    ) {
        this.boxes = boxes;
        this.boxCount = this.boxes.length;
        this.boxProb = new Array<number>(this.boxCount).fill(0);
        this.hashTally = new Array<bigint>(this.boxCount).fill(0n);
        
        this.witnesses = witnesses;

        this.minesLeft = minesLeft;
        this.squaresLeft = squaresLeft;
        
        this.deadLocations = deadLocations;

        this.minTotalMines = this.minesLeft - this.squaresLeft;
        this.maxTotalMines = this.minesLeft;
    }

    public getProbability(location: LocationDto): number
    {
        for (const b of this.boxes) {
            if (b.contains(location)) {
                return this.boxProb[b.getUID];
            }
        }

        return this.offEdgeProbability;
    }

    public get foundCertainty(): boolean
    {
        return 0 === 1 - this.bestProbability;
    }

    public getLinkedLocation(tile: LocationDto): LinkedLocationDto
    {
        for (const ll of this.linkedLocations) {
            if (ll.equals(tile)) {
                return ll;
            }
        }

        return null;
    }
}

