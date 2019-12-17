import { disposition } from '../fixtures/state/3x3.single-exposed.json';
import BoardDto from "../../src/dto/board.dto";
import { BoardStateComputation } from "../../src/computation/board-state.computation";
import BoardStateDto from "../../src/dto/board-state.dto";
import LocationDto from "../../src/dto/location.dto";
import AreaDto from "../../src/dto/area.dto";

describe('BoardStateDto', () => {
    test('getUnrevealedArea on a disposition with a single exposed tile', () => {
        const board = new BoardDto(disposition);
        const boardStateComputation = new BoardStateComputation(board.height, board.width);

        boardStateComputation.setBoard = board;
        boardStateComputation.process();

        const boardState: BoardStateDto = boardStateComputation.getBoardState;

        const unrevealed: number = boardState.getTotalUnrevealedCount;
        expect(unrevealed).toBe(8);

        const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
        const expectedWitnesses = [
            new LocationDto(2, 0)
        ];
        expect(allWitnesses).toStrictEqual(expectedWitnesses);

        const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);
        expect(allWitnessedSquares).toMatchSnapshot();
    });
});
