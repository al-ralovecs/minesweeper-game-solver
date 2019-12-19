import ServiceInterface from "../interface/service.interface";
import ProbabilityLineDto from "../dto/probability-line.dto";
import LinkedLocationDto from "../dto/linked-location.dto";
import LocationDto from "../dto/location.dto";
import BoardStateDto from "../dto/board-state.dto";
import WitnessWebDto from "../dto/witness-web.dto";
import WitnessDto from "../dto/witness.dto";
import BoxDto from "../dto/box.dto";
import AreaDto from "../dto/area.dto";
import NextWitnessDto from "../dto/next-witness.dto";

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
    private boxCount: number;
    private witnesses: WitnessDto[];
    private boxes: BoxDto[];
    private minesLeft: number;
    private squaresLeft: number;
    private deadLocations: AreaDto;

    private independentGroups: number = 0;
    private recursions: number = 0;

    private finalSolutionsCount: bigint;

    private minTotalMines: number;
    private maxTotalMines: number;

    private mineCounts: [number, bigint][];

    public constructor(boardState: BoardStateDto, web: WitnessWebDto, squaresLeft: number, minesLeft: number, deadLocations: AreaDto)
    {
        this.boardState = boardState;
        this.web = web;
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

            this.workingProbs = this.mergeProbabilities(witness);

            witness = this.findNextWitness(witness);
        }

        this.calculateBoxProbabilities();
    }
}

/**

 */