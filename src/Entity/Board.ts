import Coordinate from "./Coordinate";
import countFlags from '../Routine/board.matrix.countTotalFlags';
import countFlagsAround from '../Routine/board.item.countFlagsAround';
import flagMines from '../Routine/board.matrix.flagMines';
import generateBitwiseMatrix from '../Routine/board.matrix.generateBitwise';
import getFlag from '../Routine/board.item.getFlag';
import getIsBoundary from '../Routine/board.item.getIsBoundary';
import getTotalItemsAround from '../Routine/board.item.getTotalItemsAround';
import getValue from '../Routine/board.item.getValue';
import isCoordinatesValid from '../Routine/board.coordinates.isValid';
import isValid from '../Routine/board.matrix.isValid';
import listBorderItems from '../Routine/region.board.listBorderItems';
import listEmptyItems from '../Routine/region.board.listEmptyItems';

export default class Board {
    private readonly data: number[][];

    public readonly height: number;
    public readonly width: number;

    private modelMines: boolean[][];
    private modelEmpty: boolean[][];

    public constructor(data: number[][], initialize: boolean = true)
    {
        if (! Board.isValid(data)) {
            throw Error();
        }

        this.data = data;
        this.height = data.length;
        this.width = data[0].length;

        if (initialize) {
            this.initialize();
            this.flagMines();
        }
    }

    public getValue(y: number, x: number): number
    {
        return getValue(this.data, y, x, this.height, this.width);
    }

    public getIsBoundary(y: number, x: number): boolean
    {
        return getIsBoundary(this.data, y, x, this.height, this.width);
    }

    public getIsMine(y: number, x: number): boolean
    {
        return getFlag(this.modelMines, y, x, this.height, this.width);
    }

    public setIsMine(y: number, x: number, flag: boolean = true): void
    {
        if (isCoordinatesValid(y, x, this.height, this.width)) {
            this.modelMines[y][x] = flag;
        }
    }

    public get countMines(): number
    {
        return countFlags(this.modelMines, this.height, this.width);
    }

    public getIsEmpty(y: number, x: number): boolean
    {
        return getFlag(this.modelEmpty, y, x, this.height, this.width);
    }

    public setIsEmpty(y: number, x: number, flag: boolean = true): void
    {
        if (isCoordinatesValid(y, x, this.height, this.width)) {
            this.modelEmpty[y][x] = flag;
        }
    }

    public get countEmpty(): number
    {
        return countFlags(this.modelEmpty, this.height, this.width);
    }

    public countMinesAround(y: number, x: number): number
    {
        return countFlagsAround(this.modelMines, y, x, this.height, this.width);
    }

    public countEmptyItemsAround(y: number, x: number): number
    {
        return countFlagsAround(this.modelEmpty, y, x, this.height, this.width);
    }

    public getTotalItemsAround(y: number, x: number): number
    {
        return getTotalItemsAround(y, x, this.height, this.width);
    }

    public get isConsistent(): boolean
    {
        for (let i: number = 0; i < this.height; i++) {
            for (let j: number = 0; j < this.width; j++) {
                if (this.getValue(i, j) < 0) {
                    continue;
                }

                if (this.getValue(i, j) < this.countMinesAround(i, j)) {
                    return false;
                }

                if (this.getTotalItemsAround(i, j) - this.countEmptyItemsAround(i, j) < this.getValue(i, j)) {
                    return false;
                }
            }
        }

        return true;
    }

    public get listEmptyItems(): Coordinate[]
    {
        return listEmptyItems(this);
    }

    public get listBorderItems(): Coordinate[]
    {
        return listBorderItems(this);
    }

    private initialize(): void
    {
        this.modelMines = generateBitwiseMatrix(this.height, this.width);
        this.modelEmpty = generateBitwiseMatrix(this.height, this.width);
    }

    private flagMines(): void
    {
        this.modelMines = flagMines(this.modelMines, this.data, this.height, this.width);
    }

    private static isValid(state: number[][]): boolean
    {
        return isValid(state);
    }
}
