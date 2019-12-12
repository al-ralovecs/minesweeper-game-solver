import BoardDto from "../dto/board.dto";
import CoordinateDto from "../dto/coordinate.dto";

export default abstract class AbstractStrategy
{
    protected readonly board: BoardDto;
    protected totalMinesCount: number;
    protected solution: CoordinateDto;
    protected isHasSolution: boolean = false;

    protected constructor(board: BoardDto, totalMinesCount: number)
    {
        this.board = board;
        this.totalMinesCount = totalMinesCount;
    }

    public abstract apply();

    public get hasSolution(): boolean
    {
        return this.isHasSolution && typeof this.solution !== 'undefined';
    }

    public get getNextMove(): CoordinateDto
    {
        if (typeof this.solution === 'undefined') {
            throw Error('[Strategy] Fail on attempt to query a solution that does not exist');
        }

        return this.solution;
    }
}
