import { disposition } from '../fixtures/state/3x3.filled.json';
import BoardDto from '../../src/dto/board.dto';
import BoardStateService from '../../src/service/board-state.service';

describe('BoardStateService', () => {
    test('check how computes filled board', () => {
        const board = new BoardDto(disposition);
        const boardStateService = new BoardStateService(board.height, board.width, 3);

        boardStateService.setBoard = board;
        boardStateService.process();

        expect(boardStateService.getBoardState).toMatchSnapshot();
    })
});
