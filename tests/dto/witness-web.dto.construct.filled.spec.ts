import { disposition } from '../fixtures/state/3x3.filled.json';
import BoardDto from "../../src/dto/board.dto";
import { BoardStateComputation } from "../../src/computation/board-state.computation";
import BoardStateDto from "../../src/dto/board-state.dto";
import LocationDto from "../../src/dto/location.dto";
import AreaDto from "../../src/dto/area.dto";
import WitnessWebDto from "../../src/dto/witness-web.dto";
import Binomial from "../../src/utility/binomial";

describe('WitnessWebDto', () => {
    test('construct on filled disposition', () => {
        const board = new BoardDto(disposition);
        const boardStateComputation = new BoardStateComputation(board.height, board.width, 2);

        boardStateComputation.setBoard = board;
        boardStateComputation.process();

        const boardState: BoardStateDto = boardStateComputation.getBoardState;

        const unrevealed: number = boardState.getTotalUnrevealedCount;
        const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
        const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);

        const binomialEngine: Binomial = new Binomial(1000000, 100);

        const wholeEdge: WitnessWebDto = new WitnessWebDto(boardState, allWitnesses, allWitnessedSquares.getLocations.data, binomialEngine);

        expect(wholeEdge).toMatchSnapshot();
    });
});
