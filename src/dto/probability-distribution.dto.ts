import AreaDto from './area.dto';
import BoxDto from './box.dto';
import LocationDto from './location.dto';
import WitnessDto from './witness.dto';

export default class ProbabilityDistributionDto
{
    public readonly boxes: BoxDto[];
    public readonly boxCount: number;
    public boxProb: number[];

    public hashTally: bigint[];

    public readonly witnesses: WitnessDto[];

    public readonly minesLeft: number;
    public readonly squaresLeft: number;
    public deadLocations: AreaDto;

    public readonly minTotalMines: number;
    public readonly maxTotalMines: number;

    public offEdgeBest: boolean = true;
    public offEdgeProbability: number;
    public bestProbability: number;
    public cutOffProbability: number;

    public constructor(
        boxes: BoxDto[],
        witnesses: WitnessDto[],
        minesLeft: number,
        squaresLeft: number,
        deadLocations: AreaDto
    ) {
        this.boxes = boxes;
        this.boxCount = this.boxes.length;
        this.boxProb = new Array<number>(this.boxCount);
        this.hashTally = new Array<bigint>(this.boxCount);
        
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
}
