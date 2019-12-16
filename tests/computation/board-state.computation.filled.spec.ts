import { disposition } from '../fixtures/state/3x3.json';
import BoardDto from "../../src/dto/board.dto";
import BoardStateComputation from "../../src/computation/board-state.computation";

describe('BoardStateComputation', () => {
    test('check how computes filled board', () => {
        const board = new BoardDto(disposition);
        const boardStateComputation = new BoardStateComputation(board.height, board.width);

        boardStateComputation.setBoard = board;
        boardStateComputation.do();

        expect(boardStateComputation.getBoardState).toMatchSnapshot();
    })
});
