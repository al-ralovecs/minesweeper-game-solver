import PlayInterface from '../interface/play.interface';

import LocationDto from '../dto/location.dto';
import BoardStateDto from '../dto/board-state.dto';

export enum StrategyType
{
    FirstMove,
    TrivialSearch,
    LocalSearch,
    FindAllMines,
    ExposeWhenSure,
    Deduce,
    GuessAsDoItOrDie,
}

export abstract class AbstractStrategy implements PlayInterface
{
    public readonly name: StrategyType;

    protected readonly boardState: BoardStateDto;

    protected solution: LocationDto;
    protected isHasSolution: boolean = false;

    public constructor(boardState: BoardStateDto)
    {
        this.boardState = boardState;
    }

    public abstract apply();

    public get hasSolution(): boolean
    {
        return this.isHasSolution && typeof this.solution !== 'undefined';
    }

    public get getNextMove(): LocationDto
    {
        if (typeof this.solution === 'undefined') {
            throw Error('[Strategy] Fail on attempt to query a solution that does not exist');
        }

        return this.solution;
    }
}
