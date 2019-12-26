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

@Injectable()
@WebSocketGateway({ upgrade: false, reconnection: true, forceNew: false })
export class GameService
{
    @WebSocketServer()
    server: Server;

    private play: Play;
    private gameServer: WebSocket;

    private silent: boolean = false;
    private level: number = 1;
    private rounds: number = 1;

    private currentRound: number = 0;

    private minesCountList: object = { 1: 16, };

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
        this.currentRound = 0;

        if (this.currentRound >= this.rounds) {
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
                this.getMap()
                    .catch((e) => this.log(LogPriority.Error, 'Failed to get the board disposition map', e));
                break;
            case GameServerResponseType.Map:
                this.log(LogPriority.Debug, 'A new map received', data);
                //this.getOpen(this.getPlay.getNextMove(new BoardDto(response.board)))
                //    .catch((e) => this.log(LogPriority.Error, 'Failed to open a new tile on board', e));
                break;
            default:
                this.log(LogPriority.Debug, 'A new message from Game-server received', data);
                //throw Error(`[GameService::processor] Invalid operation type ${response.type} provided`);
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
            this.play = new Play(new Binomial(1000000, 100), this.getMines);
        }

        return this.play;
    }

    private get getMines(): number
    {
        return this.minesCountList[this.level];
    }

    private log(level: LogPriority, message: string, payload?: any): WsResponse<string>
    {
        if (this.silent && LogPriority.Error !== level) {
            return;
        }

        this.server.emit('logger', '[' + LogPriority[level] + '] ' + message + GameService.getPayload(payload) + '\n');
    }

    private static getPayload(payload: any): string
    {
        const prefix: string = '; payload: \n';

        if (typeof payload === 'string') {
            return prefix + payload;
        }

        if (typeof payload === 'undefined') {
            return '';
        }

        if (null === payload) {
            return '';
        }

        try {
            return prefix + payload.toString();
        } catch (e) {
            //
        }

        return prefix + typeof payload;
    }
}
