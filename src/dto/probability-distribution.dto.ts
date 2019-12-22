import AreaDto from './area.dto';
import BoxDto from './box.dto';
import LocationDto from './location.dto';
import WitnessDto from './witness.dto';
import CandidateLocationDto from "./candidate-location.dto";

export const PROBABILITY_ENGINE_TOLERANCE: number = 0.96;

export default class ProbabilityDistributionDto
{
    public readonly boxes: BoxDto[];
    public readonly boxCount: number;
    public boxProb: number[];

    public hashTally: bigint[];

    public readonly witnesses: WitnessDto[];

    public minesLeft: number;
    public squaresLeft: number;
    public deadLocations: AreaDto;

    public readonly minTotalMines: number;
    public readonly maxTotalMines: number;

    public offEdgeBest: boolean = true;
    public offEdgeProbability: number;
    public bestProbability: number;
    public cutOffProbability: number;

    public finalSolutionsCount: bigint;
    public clearCount: number;

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

    public get foundCertainty(): boolean
    {
        return 0.01 >= Math.abs(this.bestProbability - 1);
    }

    public getBestCandidates(threshold: number): CandidateLocationDto[]
    {

    }
}


/**
 protected List<CandidateLocation> getBestCandidates(BigDecimal freshhold) {

		List<CandidateLocation> best = new ArrayList<>();

		//solver.display("Squares left " + this.squaresLeft + " squares analysed " + web.getSquares().size());

		// if the outside probability is the best then return an empty list
		BigDecimal test;
		//if (offEdgeBest) {
		//	solver.display("Best probability is off the edge " + bestProbability + " but will look for options on the edge only slightly worse");
		//	//test = bestProbability.multiply(Solver.EDGE_TOLERENCE);
		//	test = bestProbability.multiply(freshhold);
		//} else

		if (bestProbability.compareTo(BigDecimal.ONE) == 0){  // if we have a probability of one then don't allow lesser probs to get a look in
			test = bestProbability;
		} else {
			test = bestProbability.multiply(freshhold);
		}

		boardState.display("Best probability is " + bestProbability + " freshhold is " + test);

		for (int i=0; i < boxProb.length; i++) {
			if (boxProb[i].compareTo(test) >= 0) {
				for (Square squ: boxes.get(i).getSquares()) {
					if (!deadLocations.contains(squ) || boxProb[i].compareTo(BigDecimal.ONE) == 0) {  // if not a dead location or 100% safe then use it
						best.add(new CandidateLocation(squ.x, squ.y, boxProb[i], boardState.countAdjacentUnrevealed(squ), boardState.countAdjacentConfirmedFlags(squ)));
					} else {
						boardState.display("Location " + squ.display() + " is ignored because it is dead");
					}
				}
			}
		}

		// sort in to best order
		best.sort(CandidateLocation.SORT_BY_PROB_FLAG_FREE);

		return best;

	}
 */
