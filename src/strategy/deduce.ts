import AbstractStrategy from './abstract-strategy';
import {BoardDto} from "../dto/board.dto";

export class Deduce extends AbstractStrategy
{
    public used: number[][];

    private topToBottomPriority: boolean = true;

    public constructor(board: BoardDto, totalMinesCount: number)
    {
        super(board, totalMinesCount);

        this.init();
    }

    apply(): void
    {
        this.createPerimeterLists();
    }

    private createPerimeterLists(): void
    {

    }

    private startList(y: number, x: number): void
    {

    }
}
