import BoardDto from '../dto/board.dto';
import CoordinateDto from '../dto/coordinate.dto';
import { StrategyType } from '../strategy/strategy-type.enum';
import AbstractStrategy from '../strategy/abstract-strategy';
import FlagAllMines from '../strategy/flag-all-mines';
import ExposeWhenSure from '../strategy/expose-when-sure';
import Deduce from "../strategy/deduce";
import GuessAsDoOrDie from "../strategy/guess-as-do-or-die";


export class Play
{
    private readonly board: BoardDto;
    private readonly totalMinesCount: number;

    private currentStrategyType: number = -1;
    private exercisedStrategies: AbstractStrategy[];

    public constructor(board: BoardDto, totalMinesCount: number)
    {
        this.board = board;
        this.totalMinesCount = totalMinesCount;

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
        this.currentStrategyType++;

        let strategy: AbstractStrategy;

        switch (this.currentStrategyType) {
            case StrategyType.FindAllMines:
                strategy = new FlagAllMines(this.board, this.totalMinesCount);
                break;
            case StrategyType.ExposeWhenSure:
                strategy = new ExposeWhenSure(this.board, this.totalMinesCount);
                break;
            case StrategyType.Deduce:
                strategy = new Deduce(this.board);
                break;
            case StrategyType.GuessAsDoItOrDie:
                strategy = new GuessAsDoOrDie(this.board, this.exercisedStrategies[1]);
                break;
            default:
                throw Error(`Invalid strategy Id [${this.currentStrategyType}] provided.`);
        }

        return strategy;
    }

    private cacheCalcs(strategy: AbstractStrategy): void
    {
        if ([2].indexOf(this.currentStrategyType) === -1) {
            return;
        }

        this.exercisedStrategies[this.currentStrategyType] = strategy;
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
