import BoardDto from "../dto/board.dto";
import CoordinateDto from "../dto/coordinate.dto";

export default abstract class AbstractStrategy
{
    protected readonly board: BoardDto;
    protected mineCount: number;
    protected solution: CoordinateDto;
    protected hasSolution: boolean = false;

    public constructor(board: BoardDto, mineCount: number)
    {
        this.board = board;
        this.mineCount = mineCount;
    }

    public abstract apply();

    public get hasSolution(): boolean
    {
        return this.hasSolution && typeof this.solution !== 'undefined';
    }

    public get getNextMove(): CoordinateDto
    {
        if (typeof this.solution === 'undefined') {
            throw Error('[Strategy] Fail on attempt to query a solution that does not exist');
        }

        return this.solution;
    }
}
