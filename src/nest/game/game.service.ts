import {WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {Injectable} from '@nestjs/common';
import {Server} from 'socket.io';
import * as WebSocket from 'ws';
import {LogPriority} from '../enum/log.priority.enum';
import {config} from '../../config/config.json';
import {GameServerResponseDto, GameServerResponseType} from "../dto/game-server-response.dto";
import Play from "../../minesweeper/component/play";
import Binomial from "../../minesweeper/utility/binomial";
import BoardDto from "../../minesweeper/dto/board.dto";
import ActionDto from "../../minesweeper/dto/action.dto";
import {LogPayloadParserHelper} from "../helper/log-payload-parser.helper";

export const MinesPerLevel = {
    1: 16,
};

@Injectable()
@WebSocketGateway({ upgrade: false, reconnection: true, forceNew: false })
export class GameService
{
    @WebSocketServer()
    server: Server;
    // dependencies
    private play: Play;
    private gameServer: WebSocket;
    // user settings
    private silent: boolean = false;
    private level: number = 1;
    private rounds: number = 1;
    private isMineCountKnown: boolean = true;
    private maxMineCount: number;
    // dynamic state
    private isSessionOpened: boolean = false;
    private currentRound: number = 0;
    private isFinalMap: boolean = false;
    private attempt: number = 0;

    public set setSilent(silent: boolean)
    {
        this.silent = silent;

        this.log(LogPriority.Debug, silent ? 'Silent is turned on' : 'Debug is turned on');
    }

    public set setLevel(level: number)
    {
        this.level = level;
    }

    public set setRounds(rounds: number)
    {
        this.rounds = rounds;
    }

    public start(): void
    {
        if (this.isSessionOpened) {
            return;
        }

        this.isSessionOpened = true;
        this.currentRound = 0;

        this.startRound();
    }

    private startRound(): void
    {
        this.initPlay();
        this.currentRound++;
        this.attempt++;

        if (this.currentRound > this.rounds) {
            this.isSessionOpened = false;

            return;
        }

        this.getNewRound()
            .catch((e) => this.log(LogPriority.Error, 'Failed to initiate the game\'s new round', e));
    }

    private async isConnected(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if (typeof this.gameServer === 'undefined') {
                this.gameServer = new WebSocket(config.game_server.url);

                this.gameServer.onmessage = ({ data }) => { this.processor(data); };
                this.gameServer.onopen = () => resolve('ok');
                this.gameServer.onerror = (err) => reject(err);
            } else {
                return WebSocket.OPEN === this.gameServer.readyState
                    ? resolve('ok')
                    : reject( 'Game server is not connected');
            }
        });
    }

    private processor(data: WebSocket.Data): void
    {
        if (typeof data !== 'string') {
            return;
        }

        const response: GameServerResponseDto = new GameServerResponseDto(data);

        switch (response.type) {
            case GameServerResponseType.NewGame:
            case GameServerResponseType.TileCleared:
                this.getMap()
                    .catch((e) => this.log(LogPriority.Error, 'Failed to get the board disposition map', e));
                break;
            case GameServerResponseType.Map:
                if (! this.isFinalMap) {
                    this.log(LogPriority.Info, 'Game disposition', data);
                    this.getOpen(this.getPlay.getNextMove(new BoardDto(response.board)))
                        .catch((e) => this.log(LogPriority.Error, 'Failed to open a new tile on board', e));
                } else {
                    this.isFinalMap = false;
                    this.log(LogPriority.Info, 'Final failed disposition', data);
                    this.startRound();
                }
                break;
            case GameServerResponseType.GotMine:
                this.isFinalMap = true;
                this.getMap()
                    .catch((e) => this.log(LogPriority.Error, 'Failed to get the board disposition map', e));
                break;
            case GameServerResponseType.Win:
                this.log(
                    LogPriority.Success,
                    `Level: ${this.level}. Password: ${response.password}. Attempts: ${this.attempt}. Mine count: ${this.getMines}.`);
                break;
            default:
                this.log(LogPriority.Debug, 'A new message from Game-server received', data);
        }
    }

    private async getNewRound(): Promise<any>
    {
        return this.isConnected()
            .catch((e) => this.log(LogPriority.Error, 'Error on connecting to the Game-server', e))
            .then(() => this.send('new ' + this.level));
    }

    private async getMap(): Promise<any>
    {
        return this.isConnected()
            .catch((e) => this.log(LogPriority.Error, 'Error on connecting to the Game-server', e))
            .then(() => this.send('map'));
    }

    private getOpen(move: ActionDto): Promise<any>
    {
        this.log(LogPriority.Info, `Solver\'s next move is (${move.x}, ${move.y})`);

        return this.isConnected()
            .catch((e) => this.log(LogPriority.Error, 'Error on connecting to the Game-server', e))
            .then(() => this.send('open ' + move.x + ' ' + move.y));
    }

    private async send(command: string): Promise<any>
    {
        try {
            await this.gameServer.send(command);
        } catch (e) {
            return Promise.reject(e);
        }

        return Promise.resolve('ok');
    }

    private get getPlay(): Play {
        if (typeof this.play === 'undefined') {
            this.initPlay();
        }

        return this.play;
    }

    private initPlay(): void
    {
        this.play = new Play(new Binomial(1000000, 100), this.getMines);
    }

    private get getMines(): number
    {
        if (this.isMineCountKnown) {
            return MinesPerLevel[this.level];
        }

        return this.maxMineCount - Math.floor(this.attempt / 10);
    }

    private log(level: LogPriority, message: string, payload?: any): WsResponse<string>
    {
        if (this.silent && LogPriority.Error > level) {
            return;
        }

        this.server.emit(
            'logger',
            '[' + LogPriority[level] + '] ' +
            message +
            LogPayloadParserHelper.parse('; payload: \n', payload) + '\n',
        );
    }
}
