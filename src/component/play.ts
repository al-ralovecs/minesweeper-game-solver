import PlayInterface from '../interface/play.interface';

import BoardDto from '../dto/board.dto';
import BoardStateDto from "../dto/board-state.dto";
import LocationDto from '../dto/location.dto';

import BoardStateComputation from "../computation/board-state.computation";

import { StrategyType, AbstractStrategy } from '../strategy/abstract-strategy';
import FirstMoveStrategy from "../strategy/first-move.strategy";
import TrivialStrategy from "../strategy/trivial.strategy";

export class Play implements PlayInterface
{
    private readonly board: BoardDto;
    private readonly expectedMinesCountOnBoard: number;

    private boardState: BoardStateDto;

    private currentStrategyType: number = -1;

    public constructor(board: BoardDto, expectedMinesCountOnBoard: number)
    {
        this.board = board;
        this.expectedMinesCountOnBoard = expectedMinesCountOnBoard;
    }

    public get getNextMove(): LocationDto
    {
        this.prepareBoardState();

        let hasMove: boolean = false;
        let strategy: AbstractStrategy;

        while (! hasMove) {
            strategy = this.getNextStrategy;

            strategy.apply();

            hasMove = strategy.hasSolution;
        }

        return strategy.getNextMove;
    }

    private get getNextStrategy(): AbstractStrategy
    {
        this.currentStrategyType++;

        let strategy: AbstractStrategy;

        switch (this.currentStrategyType) {
            case StrategyType.FirstMove:
                strategy = new FirstMoveStrategy(this.boardState);
                break;
            case StrategyType.Trivial:
                strategy = new TrivialStrategy(this.boardState);
                break;
            default:
                throw Error(`Invalid strategy Id [${this.currentStrategyType}] provided.`);
        }

        return strategy;
    }

    private prepareBoardState(): void
    {
        const computation: BoardStateComputation = new BoardStateComputation(this.board.height, this.board.width);
        computation.setBoard = this.board;
        computation.process();

        this.boardState = computation.getBoardState;
    }
}
