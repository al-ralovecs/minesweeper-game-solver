import disposition from '../fixtures/state/3x3.empty.json.js';
import BoardDto from "../../src/dto/board.dto";

describe('BoardDto', () => {
    test('test', () => {
        const board = new BoardDto(disposition);

        expect(board.height).toBe(3);
        expect(board.width).toBe(3);
    })
});
