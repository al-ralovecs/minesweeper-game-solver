import { disposition } from '../fixtures/state/10x10.empty.json';
import BoardDto from "../../src/dto/board.dto";
import {Play} from "../../src/component/play";
import LocationDto from "../../src/dto/location.dto";

describe('Play: FirstMove strategy', () => {
    test('check if provides first move', () => {
        const board = new BoardDto(disposition);
        const play: Play = new Play(board, 16);

        expect(play.getNextMove).toStrictEqual(new LocationDto(4, 4));
    });
});
