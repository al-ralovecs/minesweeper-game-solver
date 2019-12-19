import { disposition } from '../__fixtures__/state/3x3.empty.json';
import BoardDto from '../../src/dto/board.dto';
import BoardStateService from '../../src/service/board-state.service';

describe('BoardStateService', () => {
    test('check how computes empty board', () => {
        const board = new BoardDto(disposition);
        const boardStateService = new BoardStateService(board.height, board.width, 4);

        boardStateService.setBoard = board;
        boardStateService.process();

        expect(boardStateService.getBoardState).toMatchSnapshot();
    });
});
