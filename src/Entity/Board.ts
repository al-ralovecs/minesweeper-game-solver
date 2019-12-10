import BitwiseMatrix from './BitwiseMatrix';
import countUnrevealedItemsAround from '../Routine/board.item.countUnrevealedItemsAround';
import flagEmpty from '../Routine/board.matrix.flagEmpty';
import flagMines from '../Routine/board.matrix.flagMines';
import getIsBoundary from '../Routine/board.item.getIsBoundary';
import getTotalItemsAround from '../Routine/board.item.getTotalItemsAround';
import getValue from '../Routine/board.item.getValue';
import isValid from '../Routine/board.matrix.isValid';

export default class Board {
    private readonly data: number[][];

    public readonly height: number;
    public readonly width: number;

    private modelMines: BitwiseMatrix;
    private modelEmpty: BitwiseMatrix;

    public constructor(data: number[][], init: boolean = true)
    {
        if (! Board.isValid(data)) {
            throw Error();
        }

        this.data = data;
        this.height = data.length;
        this.width = data[0].length;

        if (init) {
            this.modelMines = new BitwiseMatrix(this.height, this.width);
            this.modelEmpty = new BitwiseMatrix(this.height, this.width);

            this.modelMines.setData = flagMines(this.modelMines.getData, this.data, this.height, this.width);
            this.modelEmpty.setData = flagEmpty(this.modelEmpty.getData, this.data, this.height, this.width);
        }
    }

    public get getMinesMap(): BitwiseMatrix
    {
        return this.modelMines;
    }

    public set setMinesMap(modelMines: BitwiseMatrix)
    {
        this.modelMines = modelMines;
    }

    public get getEmptyMap(): BitwiseMatrix
    {
        return this.modelEmpty;
    }

    public set setEmptyMap(modelEmpty: BitwiseMatrix)
    {
        this.modelEmpty = modelEmpty;
    }

    public getValue(y: number, x: number): number
    {
        return getValue(this.data, y, x, this.height, this.width);
    }

    public getIsBoundary(y: number, x: number): boolean
    {
        return getIsBoundary(this.data, y, x, this.height, this.width);
    }

    public countUnrevealedItemsAround(y: number, x: number): number
    {
        return countUnrevealedItemsAround(this.data, y, x, this.height, this.width);
    }

    public getTotalItemsAround(y: number, x: number): number
    {
        return getTotalItemsAround(y, x, this.height, this.width);
    }

    public get clone(): Board
    {
        const board: Board = new Board(this.data, false);
        board.setMinesMap = this.modelMines;
        board.setEmptyMap = this.modelEmpty;

        return board;
    }

    public get isConsistent(): boolean
    {
        for (let i: number = 0; i < this.height; i++) {
            for (let j: number = 0; j < this.width; j++) {
                if (this.getValue(i, j) < 0) {
                    continue;
                }

                if (this.getValue(i, j) < this.modelMines.countAround(i, j)) {
                    return false;
                }

                if (this.getTotalItemsAround(i, j) - this.modelEmpty.countAround(i, j) < this.getValue(i, j)) {
                    return false;
                }
            }
        }

        return true;
    }

    private static isValid(state: number[][]): boolean
    {
        return isValid(state);
    }
}
