import BoxDto from './box.dto';
import LocationDto from './location.dto';
import SquareDto from './square.dto';
import WitnessDto from './witness.dto';

export default class WitnessWebDto {
    public readonly originalWitnesses: LocationDto[];
    public squares: SquareDto[] = [];

    public prunedWitnesses: WitnessDto[] = [];

    public boxes: BoxDto[] = [];

    public independentWitnesses: WitnessDto[] = [];
    public independentMines: number;
    public independentIterations: bigint = BigInt(1);
    public remainingSquares: number;

    public pruned: number = 0;
    public webNum: number = 0;

    public validWeb: boolean = true;

    // private solutions: CrunchResultDto[] = [];

    public constructor(allWit: LocationDto[], allSqu: LocationDto[]) {
        this.originalWitnesses = allWit;

        for (const squ of allSqu) {
            this.squares.push(new SquareDto(squ));
        }
    }

    public get getPrunedWitnesses(): WitnessDto[] {
        return this.prunedWitnesses;
    }

    public get getSquares(): SquareDto[] {
        return this.squares;
    }

    public get getBoxes(): BoxDto[] {
        return this.boxes;
    }

    public isOnWeb(location: LocationDto): boolean {
        for (const s of this.squares) {
            if (s.equals(location)) {
                return true;
            }
        }

        return false;
    }

    public get isWebValid(): boolean {
        return this.validWeb;
    }
}
