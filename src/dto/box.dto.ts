import WitnessDto from "./witness.dto";
import SquareDto from "./square.dto";

export default class BoxDto
{
    private adjWitnesses: WitnessDto[];
    private squares: SquareDto[] = [];

    private maxMines: number;
    private minMines: number;

    private uid: number;

    private processed: boolean = false;

    public constructor(square: SquareDto, uid: number)
    {
        this.uid = uid;

        this.adjWitnesses = square.getWitnesses;
        this.squares.push(square);

        this.adjWitnesses.forEach(w => {
           w.addBox = this;
        });
    }

    public fitsBox(square: SquareDto): boolean
    {
        if (this.adjWitnesses.length !== square.getWitnesses.length) {
            return false;
        }

        for (const w of square.getWitnesses) {
            let found: boolean = false;

            for (const boxWitness of this.adjWitnesses) {
                if (w.equals(boxWitness)) {
                    found = true;
                    break;
                }
            }

            if (found) {
                continue;
            }

            return false;
        }

        return true;
    }

    public get isProcessed(): boolean
    {
        return this.processed;
    }

    public set setProcessed(processed: boolean)
    {
        this.processed = processed;
    }

    public get getUID(): number
    {
        return this.uid;
    }

    public set addSquare(square: SquareDto)
    {
        this.squares.push(square);
    }

    public calculate(minesLeft: number): void
    {
        this.maxMines = Math.min(this.squares.length, minesLeft);
        this.minMines = 0;

        for (const w of this.adjWitnesses) {
            if (w.getMines < this.maxMines) {
                this.maxMines = w.getMines;
            }
        }
    }
}

/**

 */