import PlayInterface from '../interface/play.interface';

import BoardDto from '../dto/board.dto';
import BoardStateDto from '../dto/board-state.dto';
import LocationDto from '../dto/location.dto';
import WitnessWebDto from '../dto/witness-web.dto';

import Binomial from '../utility/binomial';
import BoardStateComputation from '../computation/board-state.computation';
import WitnessWebService from "../computation/witness-web.service";

import { StrategyType, AbstractStrategy } from '../strategy/abstract-strategy';
import FirstMoveStrategy from '../strategy/first-move.strategy';
import TrivialSearchStrategy from '../strategy/trivial-search.strategy';
import LocalSearchStrategy from "../strategy/local-search.strategy";


export class Play implements PlayInterface
{
    private readonly board: BoardDto;
    private readonly binomialEngine: Binomial;
    private readonly expectedMinesCountOnBoard: number;

    private boardState: BoardStateDto;
    private wholeEdge: WitnessWebDto;

    private currentStrategyType: number = 0;

    public constructor(board: BoardDto, binomialEngine: Binomial, expectedMinesCountOnBoard: number)
    {
        this.board = board;
        this.binomialEngine = binomialEngine;
        this.expectedMinesCountOnBoard = expectedMinesCountOnBoard;
    }

    public get getNextMove(): LocationDto
    {
        let hasMove: boolean = false;
        let strategy: AbstractStrategy;

        while (! hasMove) {
            this.prepareAnalysis();

            strategy = this.getNextStrategy;

            strategy.apply();

            hasMove = strategy.hasSolution;

            if (! hasMove) {
                this.currentStrategyType++;
            }
        }

        return strategy.getNextMove;
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
            default:
                throw Error(`[Play::getNextStrategy] Invalid strategy Id [${this.currentStrategyType}] provided.`);
        }

        return strategy;
    }

    private prepareAnalysis(): void
    {
        switch (this.currentStrategyType) {
            case StrategyType.FirstMove:
                const computation: BoardStateComputation = new BoardStateComputation(
                    this.board.height,
                    this.board.width,
                    this.expectedMinesCountOnBoard
                );

                computation.setBoard = this.board;
                computation.process();

                this.boardState = computation.getBoardState;
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
                break;
            default:
                throw Error(`[Play::prepareAnalysis] Invalid strategy Id [${this.currentStrategyType}] provided.`);
        }
    }
}
