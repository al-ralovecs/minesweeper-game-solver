import LocationDto from "./location.dto";
import WitnessDto from "./witness.dto";
import SquareDto from "./square.dto";
import BoxDto from "./box.dto";
import BoardStateDto from "./board-state.dto";
import Binomial from "../utility/binomial";

export default class WitnessWebDto {
    private readonly originalWitnesses: LocationDto[];
    private prunedWitnesses: WitnessDto[] = [];
    private squares: SquareDto[] = [];

    private boxes: BoxDto[] = [];

    private independentWitnesses: WitnessDto[] = [];
    private independentMines: number;
    private independentIterations: bigint = 1n;
    private remainingSquares: number;

    private boardState: BoardStateDto;

    private pruned: number = 0;
    private webNum: number = 0;

    private validWeb: boolean = true;

    //private solutions: CrunchResultDto[] = [];

    public constructor(boardState: BoardStateDto, allWit: LocationDto[], allSqu: LocationDto[], binomialEngine: Binomial)
    {
        this.boardState = boardState;
        this.originalWitnesses = allWit;

        allSqu.forEach(squ => {
            this.squares.push(new SquareDto(squ));
        });

        let adjSqu: SquareDto[];
        this.originalWitnesses.forEach(wit => {
           let mines: number = boardState.getWitnessValue(wit) - boardState.countAdjacentConfirmedFlags(wit);

           adjSqu = [];
           this.squares.forEach(squ => {
               if (squ.isAdjacent(wit)) {
                   adjSqu.push(squ);
               }
           });

           this.addWitness = new WitnessDto(wit, mines, adjSqu, binomialEngine);
        });

        this.prunedWitnesses.sort(WitnessDto.sortByIterationsDesc);

        for (const wit of this.prunedWitnesses) {
            for (const squ of this.squares) {
                if (squ.isAdjacent(wit)) {
                    squ.addWitness= wit;
                }
            }
        }

        this.remainingSquares = this.squares.length;

        for (const w of this.prunedWitnesses) {
            let okay: boolean = true;
            for (const iw of this.independentWitnesses) {
                if (w.overlap(iw)) {
                    okay = false;
                    break;
                }
            }

            if (! okay) {
                continue;
            }

            this.remainingSquares = this.remainingSquares - w.getSquares.length;
            this.independentIterations = this.independentIterations * binomialEngine.getCombination(w.getMines, w.getSquares.length);
            this.independentMines = this.independentMines + w.getMines;
            this.independentWitnesses.push(w);
        }

        this.webNum = 0;
        for (const squ of this.squares) {
            if (0 === squ.getWebNum) {
                this.webNum++;
                this.setWeb(squ, this.webNum);
            }
        }

        let boxCount: number = 0;
        for (const squ of this.squares) {
            let found: boolean = false;

            for (const b of this.boxes) {
                if (b.fitsBox(squ)) {
                    b.addSquare = squ;
                    found = true;
                    break;
                }
            }

            if (found) {
                continue;
            }

            this.boxes.push(new BoxDto(squ, boxCount));
            boxCount++;
        }

        let minesLeft: number = boardState.getMines - boardState.getConfirmedFlagCount;

        for (const b of this.boxes) {
            b.calculate(minesLeft);
        }
    }

    private set addWitness(wit: WitnessDto)
    {
        for (const w of this.prunedWitnesses) {
            if (w.equivalent(wit)) {
                if (this.boardState.getWitnessValue(w) - this.boardState.countAdjacentConfirmedFlags(w)
                    !== this.boardState.getWitnessValue(wit) - this.boardState.countAdjacentConfirmedFlags(wit)
                ) {
                    this.validWeb = false;
                }

                this.pruned++;
                return;
            }
        }

        this.prunedWitnesses.push(wit);
    }

    private setWeb(squ: SquareDto, num: number): void
    {
        if (0 !== squ.getWebNum && num !== squ.getWebNum) {
            // log.error
        }

        if (squ.getWebNum === num) {
            return;
        }

        squ.setWebNum = num;

        for (const w of squ.getWitnesses) {
            w.setWebNum = num;

            for (const s of w.getSquares) {
                this.setWeb(s, num); // recursion
            }
        }
    }
}

/**

 */