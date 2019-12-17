import BoardStateDto from "../dto/board-state.dto";
import WitnessWebDto from "../dto/witness-web.dto";
import Binomial from "../utility/binomial";
import LocationDto from "../dto/location.dto";
import SquareDto from "../dto/square.dto";
import WitnessDto from "../dto/witness.dto";
import BoxDto from "../dto/box.dto";

export default class WitnessWebService
{
    private readonly boardState: BoardStateDto;
    private witnessWeb: WitnessWebDto;

    private readonly binomialEngine: Binomial;

    private allWitnesses: LocationDto[];
    private allSquares: LocationDto[];

    public constructor(boardState: BoardStateDto, binomialEngine: Binomial)
    {
        this.boardState = boardState;
        this.binomialEngine = binomialEngine;
    }

    public set setAllWitnesses(allWitnesses: LocationDto[])
    {
        this.allWitnesses = allWitnesses;
    }

    public set setAllSquares(allSquares: LocationDto[])
    {
        this.allSquares = allSquares;
    }

    public get getWitnessWeb(): WitnessWebDto
    {
        return this.witnessWeb;
    }

    public process(): void
    {
        if (typeof this.allWitnesses === 'undefined') {
            throw Error('[WitnessWebService] You should provide all-witnesses collection before processing');
        }

        if (typeof this.allSquares === 'undefined') {
            throw Error('[WitnessWebService] You should provide all-squares collection before processing');
        }

        this.witnessWeb = new WitnessWebDto(this.allWitnesses, this.allSquares);

        this.init();
    }

    private init(): void
    {
        let adjSqu: SquareDto[];
        this.witnessWeb.originalWitnesses.forEach(wit => {
            let mines: number = this.boardState.getWitnessValue(wit) - this.boardState.countAdjacentConfirmedFlags(wit);

            adjSqu = [];
            for (const squ of this.witnessWeb.squares) {
                if (squ.isAdjacent(wit)) {
                    adjSqu.push(squ);
                }
            }

            this.addWitness = new WitnessDto(wit, mines, adjSqu, this.binomialEngine);
        });

        this.witnessWeb.prunedWitnesses.sort(WitnessDto.sortByIterationsDesc);

        for (const wit of this.witnessWeb.prunedWitnesses) {
            for (const squ of this.witnessWeb.squares) {
                if (squ.isAdjacent(wit)) {
                    squ.addWitness= wit;
                }
            }
        }

        this.witnessWeb.remainingSquares = this.witnessWeb.squares.length;

        for (const w of this.witnessWeb.prunedWitnesses) {
            let okay: boolean = true;
            for (const iw of this.witnessWeb.independentWitnesses) {
                if (w.overlap(iw)) {
                    okay = false;
                    break;
                }
            }

            if (! okay) {
                continue;
            }

            this.witnessWeb.remainingSquares = this.witnessWeb.remainingSquares - w.getSquares.length;
            this.witnessWeb.independentIterations = this.witnessWeb.independentIterations *
                this.binomialEngine.getCombination(w.getMines, w.getSquares.length);
            this.witnessWeb.independentMines = this.witnessWeb.independentMines + w.getMines;
            this.witnessWeb.independentWitnesses.push(w);
        }

        this.witnessWeb.webNum = 0;
        for (const squ of this.witnessWeb.squares) {
            if (0 === squ.getWebNum) {
                this.witnessWeb.webNum++;
                this.setWeb(squ, this.witnessWeb.webNum);
            }
        }

        let boxCount: number = 0;
        for (const squ of this.witnessWeb.squares) {
            let found: boolean = false;

            for (const b of this.witnessWeb.boxes) {
                if (b.fitsBox(squ)) {
                    b.addSquare = squ;
                    found = true;
                    break;
                }
            }

            if (found) {
                continue;
            }

            this.witnessWeb.boxes.push(new BoxDto(squ, boxCount));
            boxCount++;
        }

        let minesLeft: number = this.boardState.getMines - this.boardState.getConfirmedFlagCount;

        for (const b of this.witnessWeb.boxes) {
            b.calculate(minesLeft);
        }
    }

    private set addWitness(wit: WitnessDto)
    {
        for (const w of this.witnessWeb.prunedWitnesses) {
            if (w.equivalent(wit)) {
                if (this.boardState.getWitnessValue(w) - this.boardState.countAdjacentConfirmedFlags(w)
                    !== this.boardState.getWitnessValue(wit) - this.boardState.countAdjacentConfirmedFlags(wit)
                ) {
                    this.witnessWeb.validWeb = false;
                }

                this.witnessWeb.pruned++;
                return;
            }
        }

        this.witnessWeb.prunedWitnesses.push(wit);
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
