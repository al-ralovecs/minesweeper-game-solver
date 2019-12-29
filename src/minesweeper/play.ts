import { AbstractStrategy, StrategyType } from './strategy/abstract-strategy';
import FirstMoveStrategy from './strategy/first-move.strategy';
import TrivialSearchStrategy from './strategy/trivial-search.strategy';
import LocalSearchStrategy from './strategy/local-search.strategy';
import FiftyFiftyGuessStrategy from './strategy/fifty-fifty-guess.strategy';
import DeadGuessStrategy from './strategy/dead-guess.strategy';
import BruteForceStrategy from './strategy/brute-force.strategy';
import OffEdgeEvaluationStrategy from './strategy/off-edge-evaluation.strategy';
import CertainSolutionsStrategy from './strategy/certain-solutions.strategy';
import CompareSolutionsStrategy from './strategy/compare-solutions.strategy';
import FinalGuessStrategy from './strategy/final-guess.strategy';
import EvaluateLocationsService from './service/evaluate-locations.service';

import Binomial from './utility/binomial';
import BoardStateService from './service/board-state.service';
import WitnessWebService from './service/witness-web.service';
import DeadLocationsService from './service/dead-locations.service';
import ProbabilityEngineService from './service/probability-engine.service';

import AreaDto from './dto/area.dto';
import ActionDto from './dto/action.dto';
import BoardDto from './dto/board.dto';
import BoardStateDto from './dto/board-state.dto';
import WitnessWebDto from './dto/witness-web.dto';
import ProbabilityDistributionDto from './dto/probability-distribution.dto';
import BinomialSetupDto from './dto/binomial-setup.dto';

export default class Play {
    private readonly binomialSetup: BinomialSetupDto;
    private readonly expectedMinesCountOnBoard: number;

    private boardStateService: BoardStateService;
    private binomialEngine: Binomial;
    private witnessWebService: WitnessWebService;
    private deadLocationsService: DeadLocationsService;
    private probabilityEngine: ProbabilityEngineService;
    private evaluateLocationsService: EvaluateLocationsService;

    private currentStrategyType: StrategyType = StrategyType.FirstMove;

    public constructor(binomialSetup: BinomialSetupDto, expectedMinesCountOnBoard: number) {
        this.binomialSetup = binomialSetup;
        this.expectedMinesCountOnBoard = expectedMinesCountOnBoard;
    }

    public getNextMove(board: BoardDto): ActionDto {
        let strategy: AbstractStrategy;

        this.resetStrategySequence();

        this.getBoardStateService(board).process();
        let hasMove: boolean = this.getBoardState.hasNextMove;

        if (! hasMove) {
            this.resetState(board);
        }

        while (! hasMove) {
            this.processAnalysis();

            strategy = this.getNextStrategy;

            strategy.apply();

            hasMove = strategy.hasNextMove;

            if (! hasMove) {
                this.moveToNextStrategy();
            }
        }

        return typeof strategy === 'undefined' ? this.getBoardState.getNextMove : strategy.getNextMove;
    }

    public get getBinomialEngine(): Binomial {
        if (typeof this.binomialEngine === 'undefined' || null === this.binomialEngine) {
            this.binomialEngine = new Binomial(this.binomialSetup);
        }

        return this.binomialEngine;
    }

    public get getBoardState(): BoardStateDto {
        if (typeof this.boardStateService === 'undefined' || null === this.boardStateService) {
            throw Error('[Play::getBoardState] Failed on attempt to get an empty BoardState');
        }

        return this.boardStateService.getBoardState;
    }

    public get getWitnessWeb(): WitnessWebDto {
        if (typeof this.witnessWebService === 'undefined' || null === this.witnessWebService) {
            throw Error('[Play::getWitnessWeb] Failed on attempt to get an empty WitnessWeb');
        }

        return this.witnessWebService.getWitnessWeb;
    }

    public get getDeadLocations(): AreaDto {
        if (typeof this.deadLocationsService === 'undefined' || null === this.deadLocationsService) {
            throw Error('[Play::getDeadLocations] Failed on attempt to get an empty DeadLocations');
        }

        return this.deadLocationsService.getData;
    }

    public get getProbabilityDistribution(): ProbabilityDistributionDto {
        if (typeof this.probabilityEngine === 'undefined' || null === this.probabilityEngine) {
            throw Error('[Play::getProbabilityDistribution] Failed on attempt to get an empty ProbabilityEngine');
        }

        return this.probabilityEngine.getProbabilityDistribution;
    }

    public get getEvaluateLocationsService(): EvaluateLocationsService {
        if (typeof this.evaluateLocationsService === 'undefined' || null === this.evaluateLocationsService) {
            this.evaluateLocationsService = new EvaluateLocationsService(
                this.getBoardState,
                this.getWitnessWeb,
                this.binomialSetup,
                this.getProbabilityDistribution,
            );
        }

        return this.evaluateLocationsService;
    }

    private moveToNextStrategy(): void {
        this.currentStrategyType++;
    }

    private resetStrategySequence(): void {
        if (StrategyType.FirstMove === this.currentStrategyType) {
            return;
        }

        if (StrategyType.BruteForce === this.currentStrategyType) {
            // @todo: when BruteForce implemented; measure, if the next move can be based on preceding analysis

            // return;
        }

        // there is no reason to implement FirstMove strategy
        // on any subsequent iteration
        this.currentStrategyType = StrategyType.TrivialSearch;
    }

    private resetState(board: BoardDto): void {
        this.boardStateService = null;
        this.binomialEngine = null;
        this.witnessWebService = null;
        this.deadLocationsService = null;
        this.probabilityEngine = null;
        this.evaluateLocationsService = null;

        this.getBoardStateService(board).process();
    }

    private get getNextStrategy(): AbstractStrategy {
        let strategy: AbstractStrategy;

        switch (this.currentStrategyType) {
            case StrategyType.FirstMove:
                strategy = new FirstMoveStrategy(
                    this.getBoardState,
                );
                break;
            case StrategyType.TrivialSearch:
                strategy = new TrivialSearchStrategy(
                    this.getBoardState,
                    this.getWitnessWeb,
                );
                break;
            case StrategyType.LocalSearch:
                strategy = new LocalSearchStrategy(
                    this.getBoardState,
                    this.getWitnessWeb,
                );
                break;
            case StrategyType.FiftyFiftyGuess:
                strategy = new FiftyFiftyGuessStrategy(
                    this.getBoardState,
                );
                break;
            case StrategyType.DeadGuess:
                strategy = new DeadGuessStrategy(
                    this.getBoardState,
                    this.getWitnessWeb,
                    this.getProbabilityDistribution,
                    this.getDeadLocations,
                );
                break;
            case StrategyType.BruteForce:
                strategy = new BruteForceStrategy(
                    this.getBoardState,
                    this.getWitnessWeb,
                    this.getProbabilityDistribution,
                );
                break;
            case StrategyType.OffEdgeEvaluation:
                strategy = new OffEdgeEvaluationStrategy(
                    this.getBoardState,
                    this.getProbabilityDistribution,
                    this.getEvaluateLocationsService,
                );
                break;
            case StrategyType.CertainSolutions:
                strategy = new CertainSolutionsStrategy(
                    this.getBoardState,
                    this.getWitnessWeb,
                    this.getProbabilityDistribution,
                );
                break;
            case StrategyType.CompareRemainingSolutions:
                strategy = new CompareSolutionsStrategy(
                    this.getBoardState,
                    this.getProbabilityDistribution,
                    this.getEvaluateLocationsService,
                );
                break;
            case StrategyType.FinalGuess:
                strategy = new FinalGuessStrategy(
                    this.getBoardState,
                    this.getWitnessWeb,
                    this.getProbabilityDistribution,
                );
                break;
            default:
                throw Error(`[Play::getNextStrategy] Invalid strategy Id [${this.currentStrategyType}] provided.`);
        }

        return strategy;
    }

    private processAnalysis(): void {
        switch (this.currentStrategyType) {
            case StrategyType.FirstMove:
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
            case StrategyType.BruteForce:
                break;
            case StrategyType.OffEdgeEvaluation:
            case StrategyType.CertainSolutions:
            case StrategyType.CompareRemainingSolutions:
            case StrategyType.FinalGuess:
                break;
            default:
                throw Error(`[Play::prepareAnalysis] Invalid strategy type Id [${this.currentStrategyType}] provided.`);
        }
    }

    private getBoardStateService(board: BoardDto): BoardStateService {
        if (typeof this.boardStateService === 'undefined' || null === this.boardStateService) {
            this.boardStateService = new BoardStateService(
                board.height,
                board.width,
                this.expectedMinesCountOnBoard,
            );
        }
        this.boardStateService.setBoard = board;

        return this.boardStateService;
    }

    private processWitnessWebService(): void {
        if (typeof this.witnessWebService === 'undefined' || null === this.witnessWebService) {
            this.witnessWebService = new WitnessWebService(this.getBoardState, this.getBinomialEngine);
            this.witnessWebService.process();
        } else  {
            this.witnessWebService.setBoardState = this.getBoardState;
            this.witnessWebService.process();
        }
    }

    private processDeadLocationsService(): void {
        if (typeof this.deadLocationsService === 'undefined' || null === this.deadLocationsService) {
            this.deadLocationsService = new DeadLocationsService(
                this.getBoardState,
                this.getWitnessWeb.getPrunedWitnesses,
            );
        }

        this.deadLocationsService.process();
    }

    private processProbabilityEngine(): void {
        if (typeof this.probabilityEngine === 'undefined' || null === this.probabilityEngine) {
            this.probabilityEngine = new ProbabilityEngineService(
                this.getBoardState,
                this.getWitnessWeb,
                this.getBinomialEngine,
                this.getDeadLocations,
            );
        }

        this.probabilityEngine.process();
        this.probabilityEngine.processBestCandidates();
    }
}
