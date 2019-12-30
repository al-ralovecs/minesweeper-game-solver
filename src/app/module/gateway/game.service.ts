import { AbstractGameLoggerAwareService } from '../logger/abstract.game-logger-aware.service';
import WebSocket = require('ws');
import Play from '../../../minesweeper/play';
import { config } from '../../../config/config.json';

import ActionDto from '../../../minesweeper/dto/action.dto';
import BinomialSetupDto from '../../../minesweeper/dto/binomial-setup.dto';
import BoardDto from '../../../minesweeper/dto/board.dto';
import { StrategyType } from '../../../minesweeper/strategy/abstract-strategy';

import { GameServerResponseDto, GameServerResponseType } from '../../dto/game-server-response.dto';
import { GameMoveDto } from '../../dto/game-move.dto';

const ProvisionalMinesPerLevel = {
    1: 16,
    2: 150,
    3: 1000,
    4: 3500,
};

export class GameService extends AbstractGameLoggerAwareService {
    // dependency
    private server: WebSocket;
    private play: Play;
    // provided from the upper layer
    private level: number;
    private rounds: number;
    // state
    private currentRound: number;
    private attempt: number = 0;
    private isFinalMap: boolean = false;
    // short-term history
    private roundHistory: Array<GameMoveDto>;
    private failureStrategies: Array<StrategyType>;

    public set setLevel(level: number) {
        this.level = level;
    }

    public set setRounds(rounds: number) {
        this.rounds = rounds;
    }

    public get getPlay(): Play {
        if (typeof this.play === 'undefined') {
            this.initPlay();
        }

        return this.play;
    }

    public playMinesweeper(): void {
        if (typeof this.level === 'undefined') {
            throw Error('[GameService:play] Cannot initiate a game without the level specified');
        }

        if (typeof this.rounds === 'undefined') {
            throw Error('[GameService:play] Cannot initiate a game without number of rounds to play specified');
        }

        this.start();
    }

    private start(): void {
        this.currentRound = 0;
        this.failureStrategies = [];

        this.success('The new game has started');

        this.startRound();
    }

    private startRound(): void {
        // aimed at statistical targets in mind;
        // possibly could be made to switch on/off
        if (this.currentRound === this.rounds
            && this.failureStrategies.length > Math.floor(0.1 * this.rounds)
        ) {
            this.failure(`Failed ${this.failureStrategies.length} times ` +
                `over previous ${this.rounds} rounds. Total ${this.attempt} attempt(s) played. ` +
                'Failure strategies list follows.',
                this.failureStrategies.map((id) => StrategyType[id])
            );

            this.currentRound = 0;
            this.failureStrategies = [];
        }

        this.initPlay();
        this.roundHistory = [];
        this.currentRound++;
        this.attempt++;

        if (this.currentRound > this.rounds) {
            return;
        }

        this.getNewRound()
            .catch((e) => this.error('Failed to initiate the game\'s new round', e));
    }

    private responseProcessor(data: WebSocket.Data): void
    {
        if (typeof data !== 'string') {
            this.error(`Invalid typeof [${typeof data}] received from Game server`);

            return;
        }

        const response: GameServerResponseDto = new GameServerResponseDto(data);

        switch (response.type) {
            case GameServerResponseType.NewGame:
            case GameServerResponseType.TileCleared:
                this.getMap()
                    .catch((e) => this.error('Failed to get a board disposition map', e));
                break;
            case GameServerResponseType.GotMap:
                this.info('Game disposition', data);

                let nextMove: ActionDto = this.getNexMoveFromPlay(response.board);

                if (typeof nextMove === 'undefined') {
                    this.roundHistory.push(new GameMoveDto(this.roundHistory.length, data));
                    this.debug('Here comes the replay of the entire game for debug', this.roundHistory);

                    return;
                }

                this.roundHistory.push(new GameMoveDto(this.roundHistory.length, data, nextMove));

                this.getOpen(nextMove)
                    .catch((e) => this.error('Failed to open a new tile on board', e));
                break;
            case GameServerResponseType.GotMine:
                this.isFinalMap = true;

                this.failure(`Failed. Attempt # ${this.attempt} ` +
                    `on ${this.getPlay.getBoardState.width} x ${this.getPlay.getBoardState.height} board. ` +
                    `Mines revealed so far: ${this.getPlay.getBoardState.getConfirmedFlagCount}.`
                );

                // save strategies that failed over entire round of several games
                this.failureStrategies.push(this.roundHistory[this.roundHistory.length - 1].value.moveMethod);

                this.startRound();
                break;
            case GameServerResponseType.Win:
                this.success(`Level: ${this.level}. ` +
                    `Password: ${response.password}. ` +
                    `Attempts: ${this.attempt}. ` +
                    `Mine count: ${this.getPlay.getBoardState.getConfirmedFlagCount}.`
                );
                //this.startRound();
                break;
            default:
                this.error('Unrecognized message from Game-server received', data);
        }
    }

    private getNexMoveFromPlay(board: number[][]): ActionDto {
        try {
            return this.getPlay.getNextMove(new BoardDto(board));
        } catch (e) {
            this.error('Play has throw an exception', e);
        }
    }

    private async isConnected(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if (typeof this.server === 'undefined') {
                this.server = new WebSocket(config.game_server.url);

                this.server.onmessage = ({ data }) => { this.responseProcessor(data); };
                this.server.onopen = () => resolve('ok');
                this.server.onerror = (err) => reject(err);
            } else {
                return WebSocket.OPEN === this.server.readyState
                    ? resolve('ok')
                    : reject( 'Game server is not connected');
            }
        });
    }

    private async getNewRound(): Promise<any>
    {
        return this.isConnected()
            .catch((e) => this.error('Error on connecting to the Game-server', e))
            .then(() => this.send('new ' + this.level));
    }

    private async getMap(): Promise<any>
    {
        return this.isConnected()
            .catch((e) => this.error('Error on connecting to the Game-server', e))
            .then(() => this.send('map'));
    }

    private getOpen(move: ActionDto): Promise<any>
    {
        this.info(`Solver\'s next move is (${move.x}, ${move.y})`);

        return this.isConnected()
            .catch((e) => this.error('Error on connecting to the Game-server', e))
            .then(() => this.send('open ' + move.x + ' ' + move.y));
    }

    private async send(command: string): Promise<any>
    {
        try {
            await this.server.send(command);
        } catch (e) {
            return Promise.reject(e);
        }

        return Promise.resolve('ok');
    }

    private initPlay(): void {
        this.play = new Play(new BinomialSetupDto(1000000, 100), this.getMines);
    }

    private get getMines(): number
    {
        return ProvisionalMinesPerLevel[this.level];
    }
}
