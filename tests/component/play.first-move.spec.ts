import { disposition } from '../fixtures/state/10x10.empty.json';
import BoardDto from "../../src/dto/board.dto";
import {Play} from "../../src/component/play";
import LocationDto from "../../src/dto/location.dto";
import Binomial from "../../src/utility/binomial";

describe('Play: FirstMove strategy', () => {
    test('check if provides first move', () => {
        const board = new BoardDto(disposition);
        const binomialEngine: Binomial = new Binomial(1000000, 100);
        const play: Play = new Play(board, binomialEngine, 16);

        expect(play.getNextMove).toStrictEqual(new LocationDto(4, 4));
    });
});
