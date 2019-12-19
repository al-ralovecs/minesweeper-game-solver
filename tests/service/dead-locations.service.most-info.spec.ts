import { disposition } from '../__fixtures__/state/16x16x40.pe.most-info.json';

import BoardDto from '../../src/dto/board.dto';
import BoardStateDto from '../../src/dto/board-state.dto';
import LocationDto from '../../src/dto/location.dto';
import AreaDto from '../../src/dto/area.dto';
import WitnessWebDto from '../../src/dto/witness-web.dto';

import BoardStateService from '../../src/service/board-state.service';
import Binomial from '../../src/utility/binomial';
import WitnessWebService from '../../src/service/witness-web.service';
import DeadLocationsService from '../../src/service/dead-locations.service';

describe('DeadLocationsService', () => {
    test('test if finds on a disposition', () => {
        const board = new BoardDto(disposition);
        const boardStateService = new BoardStateService(board.height, board.width, 40);

        boardStateService.setBoard = board;
        boardStateService.process();

        const boardState: BoardStateDto = boardStateService.getBoardState;

        const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
        const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);

        const binomialEngine: Binomial = new Binomial(1000000, 100);

        const witnessWebService: WitnessWebService = new WitnessWebService(boardState, binomialEngine);
        witnessWebService.setAllWitnesses = allWitnesses;
        witnessWebService.setAllSquares = allWitnessedSquares.getLocations.data;
        witnessWebService.process();

        const wholeEdge: WitnessWebDto = witnessWebService.getWitnessWeb;

        const deadLocationsService: DeadLocationsService = new DeadLocationsService(
            boardState,
            wholeEdge.getPrunedWitnesses
        );
        deadLocationsService.process();

        expect(deadLocationsService.getDead).toMatchSnapshot();
    });
});
