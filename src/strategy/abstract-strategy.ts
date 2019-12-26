import PlayInterface from '../interface/play.interface';

import BoardStateDto from '../dto/board-state.dto';
import ActionDto, { ActionType } from '../dto/action.dto';

export enum StrategyType {
    FirstMove,
    TrivialSearch,
    LocalSearch,
    FiftyFiftyGuess,
    DeadGuess,
    BruteForce,
    OffEdgeEvaluation,
    CertainSolutions,
    CompareRemainingSolutions,
    FinalGuess,
}

export abstract class AbstractStrategy implements PlayInterface {
    protected readonly moveMethod: StrategyType;
    protected readonly boardState: BoardStateDto;

    public constructor(boardState: BoardStateDto) {
        this.boardState = boardState;
    }

    public apply(): void {
        if (! this.isStrategyApplicable) {
            return;
        }

        this.applyStrategy();
    }

    public get hasNextMove(): boolean {
        return 0 < this.boardState
            .getActions
            .filter(a => this.getMoveMethod === a.moveMethod && ActionType.Clear === a.type)
            .length;
    }

    public get getNextMove(): ActionDto {
        return this.boardState
            .getActions
            .filter(a => this.getMoveMethod === a.moveMethod && ActionType.Clear === a.type)
            .sort((o1: ActionDto, o2: ActionDto) => o2.bigProbability - o1.bigProbability)
            .shift();
    }

    protected get isStrategyApplicable(): boolean {
        return true;
    }

    protected abstract applyStrategy(): void;

    protected abstract get getMoveMethod(): StrategyType;
}
