import { disposition } from '../fixtures/state/3x3.filled.json';
import BoardDto from '../../src/dto/board.dto';
import BoardStateComputation from '../../src/computation/board-state.computation';
import BoardStateDto from '../../src/dto/board-state.dto';
import LocationDto from '../../src/dto/location.dto';
import AreaDto from '../../src/dto/area.dto';
import WitnessWebDto from '../../src/dto/witness-web.dto';
import Binomial from '../../src/utility/binomial';
import WitnessWebService from "../../src/computation/witness-web.service";

describe('WitnessWebService', () => {
    test('process on filled disposition', () => {
        const board = new BoardDto(disposition);
        const boardStateComputation = new BoardStateComputation(board.height, board.width, 2);

        boardStateComputation.setBoard = board;
        boardStateComputation.process();

        const boardState: BoardStateDto = boardStateComputation.getBoardState;

        const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
        const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);

        const binomialEngine: Binomial = new Binomial(1000000, 100);

        const witnessWebService: WitnessWebService = new WitnessWebService(boardState, binomialEngine);
        witnessWebService.setAllWitnesses = allWitnesses;
        witnessWebService.setAllSquares = allWitnessedSquares.getLocations.data;
        witnessWebService.process();

        const wholeEdge: WitnessWebDto = witnessWebService.getWitnessWeb;

        expect(wholeEdge).toMatchSnapshot();
    });
});
