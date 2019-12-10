import generateEmptyBitwiseMatrix from '../Routine/board.matrix.generateEmptyBitwise';
import countFlags from "../Routine/board.matrix.countTotal";
import getIsFlag from "../Routine/board.item.getIsFlag";
import isCoordinatesValid from "../Routine/board.coordinates.isValid";
import countFlagsAround from "../Routine/board.item.countFlagsAround";

export default class BitwiseMatrix {
    private data: boolean[][];

    private readonly height: number;
    private readonly width: number;

    public constructor(height: number, width: number, init: boolean = true)
    {
        this.height = height;
        this.width = width;

        if (init) {
            this.data = generateEmptyBitwiseMatrix(this.height, this.width);
        }
    }

    public set setData(data: boolean[][])
    {
        this.data = data;
    }

    public get getData(): boolean[][]
    {
        return this.data;
    }

    public get count()
    {
        return countFlags(this.data, this.height, this.width);
    }

    public getIsFlag(y: number, x: number): boolean
    {
        return getIsFlag(this.data, y, x, this.height, this.width);
    }

    public setIsFlag(y: number, x: number, value: boolean = true): void
    {
        if (isCoordinatesValid(y, x, this.height, this.width)) {
            this.data[y][x] = value;
        }
    }

    public countAround(y: number, x: number): number
    {
        return countFlagsAround(this.data, y, x, this.height, this.width);
    }
}
