import { disposition } from '../fixtures/state/3x3.with-a-mine.json';
import BoardDto from '../../src/dto/board.dto';
import BoardStateService from '../../src/service/board-state.service';

describe('BoardStateService', () => {
    test('check how computes board with a mine', () => {
        const board = new BoardDto(disposition);
        const boardStateService = new BoardStateService(board.height, board.width, 1);

        boardStateService.setBoard = board;
        boardStateService.process();

        expect(boardStateService.getBoardState).toMatchSnapshot();
    });
});
