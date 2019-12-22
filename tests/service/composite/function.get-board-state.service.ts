import BoardDto from '../../../src/dto/board.dto';
import BoardStateService from '../../../src/service/board-state.service';

export default function getBoardStateService(disposition: number[][], minesTotal: number): BoardStateService
{
    const board = new BoardDto(disposition);
    const boardStateService = new BoardStateService(
        board.height,
        board.width,
        minesTotal
    );

    boardStateService.setBoard = board;
    boardStateService.process();

    return boardStateService;
}
