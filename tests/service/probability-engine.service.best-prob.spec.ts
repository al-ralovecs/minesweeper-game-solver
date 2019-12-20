import { disposition } from '../__fixtures__/state/16x16x40.pe.best-probability.json';

import BoardDto from '../../src/dto/board.dto';
import BoardStateDto from '../../src/dto/board-state.dto';
import LocationDto from '../../src/dto/location.dto';
import AreaDto from '../../src/dto/area.dto';
import WitnessWebDto from '../../src/dto/witness-web.dto';

import BoardStateService from '../../src/service/board-state.service';
import Binomial from '../../src/utility/binomial';
import WitnessWebService from '../../src/service/witness-web.service';
import DeadLocationsService from '../../src/service/dead-locations.service';
import ProbabilityEngineService from "../../src/service/probability-engine.service";
import TrivialSearchStrategy from "../../src/strategy/trivial-search.strategy";
import {AbstractStrategy} from "../../src/strategy/abstract-strategy";
import {ActionType} from "../../src/dto/action.dto";
import LocalSearchStrategy from "../../src/strategy/local-search.strategy";

describe('ProbabilityEngineService', () => {
    test('process on adopted disposition', () => {
        const mines: number = 40;

        const board = new BoardDto(disposition);
        const boardStateService = new BoardStateService(board.height, board.width, mines);

        boardStateService.setBoard = board;
        boardStateService.process();

        let boardState: BoardStateDto = boardStateService.getBoardState;

        let allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
        let allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);

        const binomialEngine: Binomial = new Binomial(1000000, 100);

        let witnessWebService: WitnessWebService = new WitnessWebService(boardState, binomialEngine);
        witnessWebService.setAllWitnesses = allWitnesses;
        witnessWebService.setAllSquares = allWitnessedSquares.getLocations.data;
        witnessWebService.process();

        let wholeEdge: WitnessWebDto = witnessWebService.getWitnessWeb;

        const trivialSearch: AbstractStrategy = new TrivialSearchStrategy(boardState, wholeEdge);
        trivialSearch.apply();
        trivialSearch.hasNextMove;

        expect(boardState.getActions.filter(a => ActionType.Clear === a.type).length).toBe(0);

        const localSearch: AbstractStrategy = new LocalSearchStrategy(boardState, wholeEdge);
        localSearch.apply();
        localSearch.hasNextMove;

        expect(boardState.getActions.filter(a => ActionType.Clear === a.type).length).toBe(0);

        allWitnesses = boardState.getAllLivingWitnesses;
        allWitnessedSquares = boardState.getUnrevealedArea(allWitnesses);

        witnessWebService = new WitnessWebService(boardState, binomialEngine);
        witnessWebService.setAllWitnesses = allWitnesses;
        witnessWebService.setAllSquares = allWitnessedSquares.getLocations.data;
        witnessWebService.process();

        wholeEdge = witnessWebService.getWitnessWeb;

        const deadLocationsService: DeadLocationsService = new DeadLocationsService(
            boardState,
            wholeEdge.getPrunedWitnesses
        );
        deadLocationsService.process();

        const unrevealed: number = boardState.getTotalUnrevealedCount;
        const minesLeft: number = mines - boardState.getConfirmedFlagCount;
        const deadLocations = deadLocationsService.getDead;

        let probabilityEngineService = new ProbabilityEngineService(boardState, wholeEdge, binomialEngine, unrevealed, minesLeft, deadLocations);
        probabilityEngineService.process();

        expect(probabilityEngineService.getOffEdgeProb).toBe(0.87487);
        expect(probabilityEngineService.cutOffProbability).toBe(0.88858464);
        expect(probabilityEngineService.bestProbability).toBe(0.925609);
    });
});
