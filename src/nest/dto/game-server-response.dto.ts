import {BoardParserHelper} from "../helper/board-parser.helper";

export enum GameServerResponseType {
    NewGame,
    Map,
}

export class GameServerResponseDto
{
    type: GameServerResponseType;
    board: number[][];

    public constructor(response: string)
    {
        this.parse(response);
    }

    private parse(response: string): void
    {
        if ('new: OK' === response) {
            this.type = GameServerResponseType.NewGame;
            this.board = null;

            return;
        }

        if (response.includes('map:')) {
            this.type = GameServerResponseType.Map;
            this.board = BoardParserHelper.parse(response.replace(/map:/g,'').trim());

            return;
        }
    }
}