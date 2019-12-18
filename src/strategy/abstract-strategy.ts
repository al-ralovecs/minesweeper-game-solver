import BoardStateDto from '../dto/board-state.dto';

export enum StrategyType
{
    FirstMove,
    TrivialSearch,
    LocalSearch,
    FiftyFiftyGuess,
    FindAllMines,
    ExposeWhenSure,
    Deduce,
    GuessAsDoItOrDie,
}

export abstract class AbstractStrategy
{
    public readonly name: StrategyType;

    protected readonly boardState: BoardStateDto;
    protected isHasSolution: boolean = false;

    public constructor(boardState: BoardStateDto)
    {
        this.boardState = boardState;
    }

    public abstract apply();

    public get hasSolution(): boolean
    {
        return this.isHasSolution;
    }
}
