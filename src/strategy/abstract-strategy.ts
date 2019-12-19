import PlayInterface from '../interface/play.interface';

import BoardStateDto from '../dto/board-state.dto';
import ActionDto, { ActionType } from '../dto/action.dto';

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

export abstract class AbstractStrategy implements PlayInterface
{
    protected readonly moveMethod: StrategyType;
    protected readonly boardState: BoardStateDto;

    public constructor(boardState: BoardStateDto)
    {
        this.boardState = boardState;
    }

    public abstract apply(): void;

    public get hasNextMove(): boolean
    {
        return 0 < this.boardState
            .getActions
            .filter(a => this.getMoveMethod === a.moveMethod && ActionType.Clear === a.type)
            .length;
    }

    public get getNextMove(): ActionDto
    {
        return this.boardState
            .getActions
            .filter(a => this.getMoveMethod === a.moveMethod && ActionType.Clear === a.type)
            .sort((o1: ActionDto, o2: ActionDto) => {
                return o2.bigProbability - o1.bigProbability
            })
            .shift();
    }

    protected abstract get getMoveMethod(): StrategyType;
}
