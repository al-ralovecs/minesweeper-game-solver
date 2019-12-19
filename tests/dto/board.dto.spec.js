import { disposition } from '../__fixtures__/state/3x3.empty.json.ts';
import BoardDto from "../../src/dto/board.dto";

describe('BoardDto', () => {
    test('test', () => {
        const board = new BoardDto(disposition);

        expect(board.height).toBe(3);
        expect(board.width).toBe(3);
    })
});
