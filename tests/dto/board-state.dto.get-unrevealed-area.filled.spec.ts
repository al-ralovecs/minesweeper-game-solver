import { disposition } from '../fixtures/state/3x3.filled.json';
import BoardDto from "../../src/dto/board.dto";
import { BoardStateComputation } from "../../src/computation/board-state.computation";
import BoardStateDto from "../../src/dto/board-state.dto";
import LocationDto from "../../src/dto/location.dto";
import AreaDto from "../../src/dto/area.dto";

describe('BoardStateDto', () => {
    test('getUnrevealedArea on filled disposition', () => {
        const board = new BoardDto(disposition);
        const boardStateComputation = new BoardStateComputation(board.height, board.width);

        boardStateComputation.setBoard = board;
        boardStateComputation.process();

        const boardState: BoardStateDto = boardStateComputation.getBoardState;

        const unrevealed: number = boardState.getTotalUnrevealedCount;
        expect(unrevealed).toBe(6);

        const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
        const expectedWitnesses = [
            new LocationDto(0, 1),
            new LocationDto(1, 0),
            new LocationDto(2, 0)
        ];
        expect(allWitnesses).toStrictEqual(expectedWitnesses);

        const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);
        expect(allWitnessedSquares).toMatchSnapshot();
    });
});
