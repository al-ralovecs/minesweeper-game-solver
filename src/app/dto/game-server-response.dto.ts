import {BoardParserHelper} from "../helper/board-parser.helper";

export enum GameServerResponseType {
    NewGame,
    GotMap,
    TileCleared,
    GotMine,
    Win,
}

export class GameServerResponseDto
{
    type: GameServerResponseType;
    password: string;
    board: number[][];

    public constructor(response: string)
    {
        this.parse(response);
    }

    private parse(response: string): void
    {
        this.board = null;
        this.password = null;

        switch (true) {
            case 'new: OK' === response:
                this.type = GameServerResponseType.NewGame;
                break;
            case response.includes('map:'):
                this.type = GameServerResponseType.GotMap;
                this.board = BoardParserHelper.parse(
                    response
                        .replace(/map:/g,'')
                        .trim(),
                );
                break;
            case 'open: OK' === response:
                this.type = GameServerResponseType.TileCleared;
                break;
            case 'open: You lose' === response:
                this.type = GameServerResponseType.GotMine;
                break;
            case response.includes('open: You win.'):
                this.type = GameServerResponseType.Win;
                this.password = response
                    .replace(/open: You win. The password for this level is:/g, '')
                    .trim();
                break;
        }
    }
}
