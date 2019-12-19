import PlayInterface from '../interface/play.interface';

import ActionDto from '../dto/action.dto';
import BoardDto from '../dto/board.dto';
import BoardStateDto from '../dto/board-state.dto';
import LocationDto from '../dto/location.dto';
import WitnessWebDto from '../dto/witness-web.dto';

import Binomial from '../utility/binomial';
import BoardStateService from '../service/board-state.service';
import WitnessWebService from '../service/witness-web.service';

import { AbstractStrategy, StrategyType } from '../strategy/abstract-strategy';
import FirstMoveStrategy from '../strategy/first-move.strategy';
import TrivialSearchStrategy from '../strategy/trivial-search.strategy';
import LocalSearchStrategy from "../strategy/local-search.strategy";
import FiftyFiftyGuessStrategy from '../strategy/fifty-fifty-guess.strategy';

export default class Play implements PlayInterface
{
    private readonly board: BoardDto;
    private readonly binomialEngine: Binomial;
    private readonly expectedMinesCountOnBoard: number;

    private boardState: BoardStateDto;
    private wholeEdge: WitnessWebDto;

    private currentStrategyType: StrategyType = StrategyType.FirstMove;

    public constructor(board: BoardDto, binomialEngine: Binomial, expectedMinesCountOnBoard: number)
    {
        this.board = board;
        this.binomialEngine = binomialEngine;
        this.expectedMinesCountOnBoard = expectedMinesCountOnBoard;
    }

    public get getNextMove(): ActionDto
    {
        let hasMove: boolean = false;
        let strategy: AbstractStrategy;

        while (! hasMove) {
            this.prepareAnalysis();

            strategy = this.getNextStrategy;

            strategy.apply();

            hasMove = strategy.hasNextMove;

            if (! hasMove) {
                this.currentStrategyType++;
            }
        }

        return strategy.getNextMove;
    }

    public get getBoardState(): BoardStateDto
    {
        return this.boardState;
    }

    public get getWitnessWeb(): WitnessWebDto
    {
        return this.wholeEdge;
    }

    public get getCurrentStrategyType(): StrategyType
    {
        return this.currentStrategyType;
    }

    private get getNextStrategy(): AbstractStrategy
    {
        let strategy: AbstractStrategy;

        switch (this.currentStrategyType) {
            case StrategyType.FirstMove:
                strategy = new FirstMoveStrategy(this.boardState);
                break;
            case StrategyType.TrivialSearch:
                strategy = new TrivialSearchStrategy(this.boardState, this.wholeEdge);
                break;
            case StrategyType.LocalSearch:
                strategy = new LocalSearchStrategy(this.boardState, this.wholeEdge);
                break;
            case StrategyType.FiftyFiftyGuess:
                strategy = new FiftyFiftyGuessStrategy(this.boardState);
                break;
            default:
                throw Error(`[Play::getNextStrategy] Invalid strategy Id [${this.currentStrategyType}] provided.`);
        }

        return strategy;
    }

    private prepareAnalysis(): void
    {
        switch (this.currentStrategyType) {
            case StrategyType.FirstMove:
                const boardStateService: BoardStateService = new BoardStateService(
                    this.board.height,
                    this.board.width,
                    this.expectedMinesCountOnBoard
                );

                boardStateService.setBoard = this.board;
                boardStateService.process();

                this.boardState = boardStateService.getBoardState;
                break;
            case StrategyType.TrivialSearch:
                const witnessWebService: WitnessWebService = new WitnessWebService(this.boardState, this.binomialEngine);

                const allWitnesses: LocationDto[] = this.boardState.getAllLivingWitnesses;

                witnessWebService.setAllWitnesses = allWitnesses;
                witnessWebService.setAllSquares = this.boardState.getUnrevealedArea(allWitnesses).getLocations.data;
                witnessWebService.process();

                this.wholeEdge = witnessWebService.getWitnessWeb;
                break;
            case StrategyType.LocalSearch:
            case StrategyType.FiftyFiftyGuess:
                break;
            default:
                throw Error(`[Play::prepareAnalysis] Invalid strategy type Id [${this.currentStrategyType}] provided.`);
        }
    }
}
