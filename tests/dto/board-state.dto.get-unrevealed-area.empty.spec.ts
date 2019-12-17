import { disposition } from '../fixtures/state/3x3.empty.json';
import BoardDto from "../../src/dto/board.dto";
import { BoardStateComputation } from "../../src/computation/board-state.computation";
import BoardStateDto from "../../src/dto/board-state.dto";
import LocationDto from "../../src/dto/location.dto";
import AreaDto from "../../src/dto/area.dto";
import LocationSetDto from "../../src/dto/location-set.dto";

describe('BoardStateDto', () => {
    test('getUnrevealedArea on empty disposition', () => {
        const board = new BoardDto(disposition);
        const boardStateComputation = new BoardStateComputation(board.height, board.width);

        boardStateComputation.setBoard = board;
        boardStateComputation.process();

        const boardState: BoardStateDto = boardStateComputation.getBoardState;

        const unrevealed: number = boardState.getTotalUnrevealedCount;
        expect(unrevealed).toBe(9);

        const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
        expect(allWitnesses).toStrictEqual([]);

        const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);
        expect(allWitnessedSquares).toStrictEqual(new AreaDto(new LocationSetDto()));
    });
});
