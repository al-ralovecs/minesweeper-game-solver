import BoardDto from '../dto/board.dto';
import CoordinateDto from '../dto/coordinate.dto';
import AbstractStrategy from '../strategy/abstract-strategy';
import ExposeWhenSure from '../strategy/expose-when-sure';
import Deduce from "../Strategy/Deduce";
import GuessAsDoOrDie from "../Strategy/GuessAsDoOrDie";
import {FlagAllMines} from "../strategy/flag-all-mines";

export default class Play
{
    private readonly board: BoardDto;
    private readonly countMines: number;

    private currentStrategyId: number = -1;
    private exercisedStrategies: AbstractStrategy[];

    public constructor(board: BoardDto, countMines: number)
    {
        this.board = board;
        this.countMines = countMines;

        this.init();
    }

    public get getNextMove(): CoordinateDto
    {
        let hasMove: boolean = false;
        let strategy: AbstractStrategy;

        while (! hasMove) {
            strategy = this.getNextStrategy;

            strategy.apply();

            hasMove = strategy.hasSolution;

            if (! hasMove) {
                this.cacheCalcs(strategy);
            }
        }

        return strategy.getNextMove;
    }

    private get getNextStrategy(): AbstractStrategy
    {
        this.currentStrategyId++;

        let strategy: AbstractStrategy;

        switch (this.currentStrategyId) {
            case 0:
                strategy = new FlagAllMines(this.board, this.countMines);
                break;
            case 1:
                strategy = new ExposeWhenSure(this.board, this.countMines);
                break;
            case 2:
                strategy = new Deduce(this.board);
                break;
            case 3:
                strategy = new GuessAsDoOrDie(this.board, this.exercisedStrategies[1]);
                break;
            default:
                throw Error(`Invalid strategy Id [${this.currentStrategyId}] provided.`);
        }

        return strategy;
    }

    private cacheCalcs(strategy: AbstractStrategy): void
    {
        if ([2].indexOf(this.currentStrategyId) === -1) {
            return;
        }

        this.exercisedStrategies[this.currentStrategyId] = strategy;
    }

    private init(): void
    {
        for (let i: number = 0; i < this.board.height; i++) {
            this.board.mines[i] = [];
            this.board.unexposed[i] = [];
            this.board.neighbors[i] = [];
            this.board.needed[i] = [];

            for (let j: number = 0; j < this.board.width; j++) {
                this.board.mines[i][j] = 0;
                this.board.unexposed[i][j] = 0;
                this.board.neighbors[i][j] = 0;
                this.board.needed[i][j] = 0;
            }
        }
    }
}
