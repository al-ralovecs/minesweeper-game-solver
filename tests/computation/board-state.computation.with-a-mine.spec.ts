import { disposition } from '../fixtures/state/3x3.with-a-mine.json';
import BoardDto from "../../src/dto/board.dto";
import { BoardStateComputation } from "../../src/computation/board-state.computation";

describe('BoardStateComputation', () => {
    test('check how computes board with a mine', () => {
        const board = new BoardDto(disposition);
        const boardStateComputation = new BoardStateComputation(board.height, board.width);

        boardStateComputation.setBoard = board;
        boardStateComputation.process();

        expect(boardStateComputation.getBoardState).toMatchSnapshot();
    });
});
