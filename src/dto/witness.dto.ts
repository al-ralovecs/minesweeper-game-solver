import LocationDto from "./location.dto";
import SquareDto from "./square.dto";
import BoxDto from "./box.dto";
import Binomial from "../utility/binomial";

export default class WitnessDto extends LocationDto {
    private readonly mines: number;
    public readonly iterations: bigint;
    private webNum: number = 0;

    private squares: SquareDto[];
    private boxes: BoxDto[] = [];

    private processed: boolean = false;

    public constructor(location: LocationDto, mines: number, adjSku: SquareDto[], binomialEngine: Binomial) {
        super(location.y, location.x);

        this.mines = mines;
        this.squares = adjSku;
        this.iterations = binomialEngine.getCombination(this.mines, this.squares.length);
    }

    public get getSquares(): SquareDto[] {
        return this.squares;
    }

    public set addSquare(square: SquareDto)
    {
        this.squares.push(square);
    }

    public get getBoxes(): BoxDto[]
    {
        return this.boxes;
    }

    public set addBox(box: BoxDto)
    {
        this.boxes.push(box);
    }

    public get getMines(): number
    {
        return this.mines;
    }

    public get getWebNum(): number
    {
        return this.webNum;
    }

    public set setWebNum(num: number)
    {
        this.webNum = num;
    }

    public get isProcessed(): boolean
    {
        return this.processed;
    }

    public set setProcessed(processed: boolean)
    {
        this.processed = processed;
    }

    public equivalent(wit: WitnessDto): boolean
    {
        if (this.squares.length !== wit.getSquares.length) {
            return false;
        }

        if (2 < Math.abs(wit.x - this.x) || 2 < Math.abs(wit.y - this.y)) {
            return false;
        }

        for (const l1 of this.squares) {
            let found: boolean = false;

            for (const l2 of wit.getSquares) {
                if (l2.equals(l1)) {
                    found = true;
                    break;
                }
            }

            if (! found) {
                return false;
            }
        }

        return true;
    }

    public overlap(w: WitnessDto): boolean
    {
        if (2 < Math.abs(w.y - this.y) || 2 < Math.abs(w.x - this.x)) {
            return false;
        }

        let result: boolean = false;

        top:
        for (const s of w.getSquares) {
            for (const s1 of this.squares) {
                if (s.equals(s1)) {
                    result = true;
                    break top;
                }
            }
        }

        return result;
    }

    public static sortByIterationsDesc(o1: WitnessDto, o2: WitnessDto): number
    {
        return Number(-(o1.iterations - o2.iterations));
    }
}

/**

 */