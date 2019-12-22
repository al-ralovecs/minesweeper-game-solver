import PlayInterface from '../interface/play.interface';

import AreaDto from '../dto/area.dto';
import ActionDto from '../dto/action.dto';
import BoardDto from '../dto/board.dto';
import BoardStateDto from '../dto/board-state.dto';
import WitnessWebDto from '../dto/witness-web.dto';
import ProbabilityDistributionDto from '../dto/probability-distribution.dto';

import Binomial from '../utility/binomial';
import BoardStateService from '../service/board-state.service';
import WitnessWebService from '../service/witness-web.service';
import DeadLocationsService from '../service/dead-locations.service';
import ProbabilityEngineService from '../service/probability-engine.service';

import {AbstractStrategy, StrategyType} from '../strategy/abstract-strategy';
import FirstMoveStrategy from '../strategy/first-move.strategy';
import TrivialSearchStrategy from '../strategy/trivial-search.strategy';
import LocalSearchStrategy from '../strategy/local-search.strategy';
import FiftyFiftyGuessStrategy from '../strategy/fifty-fifty-guess.strategy';
import DeadGuessStrategy from '../strategy/dead-guess.strategy';

export default class Play implements PlayInterface
{
    private readonly board: BoardDto;
    private readonly binomialEngine: Binomial;
    private readonly expectedMinesCountOnBoard: number;

    private boardStateService: BoardStateService;
    private witnessWebService: WitnessWebService;
    private isWitnessWebProcessed: boolean;
    private deadLocationsService: DeadLocationsService;
    private probabilityEngine: ProbabilityEngineService;

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
            this.processAnalysis();

            strategy = this.getNextStrategy;

            strategy.apply();

            hasMove = strategy.hasNextMove;

            if (! hasMove) {
                this.currentStrategyType++;
            }
        }

        return strategy.getNextMove;
    }

    public get getBinomialEngine(): Binomial
    {
        return this.binomialEngine;
    }

    public get getBoardState(): BoardStateDto
    {
        if (typeof this.boardStateService === 'undefined') {
            throw Error('[Play::getBoardState] Failed on attempt to get an empty BoardState')
        }

        return this.boardStateService.getBoardState;
    }

    public get getWitnessWeb(): WitnessWebDto
    {
        if (typeof this.witnessWebService === 'undefined') {
            throw Error('[Play::getWitnessWeb] Failed on attempt to get an empty WitnessWeb')
        }

        return this.witnessWebService.getWitnessWeb;
    }

    public get getDeadLocations(): AreaDto
    {
        if (typeof this.deadLocationsService === 'undefined') {
            throw Error('[Play::getDeadLocations] Failed on attempt to get an empty DeadLocations')
        }

        return this.deadLocationsService.getDead;
    }

    public get getProbabilityDistribution(): ProbabilityDistributionDto
    {
        if (typeof this.probabilityEngine === 'undefined') {
            throw Error('[Play::getProbabilityDistribution] Failed on attempt to get an empty ProbabilityEngine')
        }

        return this.probabilityEngine.getProbabilityDistribution;
    }

    private get getNextStrategy(): AbstractStrategy
    {
        let strategy: AbstractStrategy;

        switch (this.currentStrategyType) {
            case StrategyType.FirstMove:
                strategy = new FirstMoveStrategy(this.getBoardState);
                break;
            case StrategyType.TrivialSearch:
                strategy = new TrivialSearchStrategy(this.getBoardState, this.getWitnessWeb);
                break;
            case StrategyType.LocalSearch:
                strategy = new LocalSearchStrategy(this.getBoardState, this.getWitnessWeb);
                break;
            case StrategyType.FiftyFiftyGuess:
                strategy = new FiftyFiftyGuessStrategy(this.getBoardState);
                break;
            case StrategyType.DeadGuess:
                strategy = new DeadGuessStrategy(
                    this.getBoardState,
                    this.getWitnessWeb,
                    this.getProbabilityDistribution,
                    this.getDeadLocations
                );
                break;
            default:
                throw Error(`[Play::getNextStrategy] Invalid strategy Id [${this.currentStrategyType}] provided.`);
        }

        return strategy;
    }

    private processAnalysis(): void
    {
        switch (this.currentStrategyType) {
            case StrategyType.FirstMove:
                this.processBoardStateService();
                break;
            case StrategyType.TrivialSearch:
                this.processWitnessWebService();
                break;
            case StrategyType.LocalSearch:
            case StrategyType.FiftyFiftyGuess:
                break;
            case StrategyType.DeadGuess:
                this.processWitnessWebService();
                this.processDeadLocationsService();
                this.processProbabilityEngine();
                break;
            default:
                throw Error(`[Play::prepareAnalysis] Invalid strategy type Id [${this.currentStrategyType}] provided.`);
        }
    }

    private processBoardStateService(): void
    {
        if (typeof this.boardStateService === 'undefined') {
            this.boardStateService = new BoardStateService(
                this.board.height,
                this.board.width,
                this.expectedMinesCountOnBoard
            );

            this.boardStateService.setBoard = this.board;
            this.isWitnessWebProcessed = false;
        }

        this.boardStateService.process();
    }

    private processWitnessWebService(): void
    {
        if (typeof this.witnessWebService === 'undefined') {
            this.witnessWebService = new WitnessWebService(this.getBoardState, this.getBinomialEngine);

            this.witnessWebService.process();
        }

        else if (! this.isWitnessWebProcessed || this.getBoardState.hasNewFlagFound) {
            this.witnessWebService.setBoardState = this.getBoardState;

            this.witnessWebService.process();
        }

        this.isWitnessWebProcessed = true;
    }

    private processDeadLocationsService(): void
    {
        if (typeof this.deadLocationsService === 'undefined') {
            this.deadLocationsService = new DeadLocationsService(
                this.getBoardState,
                this.getWitnessWeb.getPrunedWitnesses
            );
        }

        this.deadLocationsService.process();
    }

    private processProbabilityEngine(): void
    {
        if (typeof this.probabilityEngine === 'undefined') {
            this.probabilityEngine = new ProbabilityEngineService(
                this.getBoardState,
                this.getWitnessWeb,
                this.getBinomialEngine,
                this.getDeadLocations
            );
        }

        this.probabilityEngine.process();
    }
}
