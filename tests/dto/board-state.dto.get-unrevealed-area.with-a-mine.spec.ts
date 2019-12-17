import { disposition } from '../fixtures/state/3x3.with-a-mine.json';
import BoardDto from "../../src/dto/board.dto";
import { BoardStateComputation } from "../../src/computation/board-state.computation";
import BoardStateDto from "../../src/dto/board-state.dto";
import LocationDto from "../../src/dto/location.dto";
import AreaDto from "../../src/dto/area.dto";

describe('BoardStateDto', () => {
    test('getUnrevealedArea on a disposition with a certain mine', () => {
        const board = new BoardDto(disposition);
        const boardStateComputation = new BoardStateComputation(board.height, board.width);

        boardStateComputation.setBoard = board;
        boardStateComputation.process();

        const boardState: BoardStateDto = boardStateComputation.getBoardState;

        const unrevealed: number = boardState.getTotalUnrevealedCount;
        expect(unrevealed).toBe(2);

        const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
        const expectedWitnesses = [
            new LocationDto(0, 1),
            new LocationDto(1, 1),
            new LocationDto(2, 1),
            new LocationDto(2, 2)
        ];
        expect(allWitnesses).toStrictEqual(expectedWitnesses);

        const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);
        expect(allWitnessedSquares).toMatchSnapshot();
    });
});
