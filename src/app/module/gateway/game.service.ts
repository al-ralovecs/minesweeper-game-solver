import {LogPriority} from "../../enum/log.priority.enum";
import Play from "../../../minesweeper/play";
import {config} from "../../../config/config.json";
import ActionDto from "../../../minesweeper/dto/action.dto";
import {GameServerResponseDto, GameServerResponseType} from "../../dto/game-server-response.dto";
import BoardDto from "../../../minesweeper/dto/board.dto";
import {LoggerService} from "@nestjs/common";
import {GameEventDto} from "../../dto/game.event.dto";
import {StrategyType} from "../../../minesweeper/strategy/abstract-strategy";
import WebSocket = require("ws");
import BinomialSetupDto from "../../../minesweeper/dto/binomial-setup.dto";

const MinesPerLevel = {
    1: 16,
};

class Move {
    constructor(
        public readonly step: number,
        public readonly disposition: string,
        public readonly value?: ActionDto,
    ) {}

    toString(): string {
        return '\n' + this.step + '\n' +
            this.disposition +
            ( typeof this.value === 'undefined'
                ? '(?, ?, ?)'
                : `(${this.value.x}, ${this.value.y}, ${StrategyType[this.value.moveMethod]}) \n`
            );
    }
}

export class GameService {
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
    // history of rounds
    private roundHistory: Array<Move>;
    private failureStrategies: Array<StrategyType>;

    constructor(private readonly logger: LoggerService) {}

    public set setLevel(level: number) {
        this.level = level;
    }

    public set setRounds(rounds: number) {
        this.rounds = rounds;
    }

    public playMinesweeper(): void {
        if (typeof this.level === 'undefined') {
            throw Error('[GameService:play] Cannot initiate a game without the level specified');
        }

        if (typeof this.rounds === 'undefined') {
            throw Error('[GameService:play] Cannot initiate a game without number of rounds to play specified');
        }

        this.log(LogPriority.Debug, 'Got Play');

        this.start();
    }

    private start(): void {
        this.currentRound = 0;
        this.failureStrategies = [];

        this.log(LogPriority.Success, 'Start a new game');

        this.startRound();
    }

    private startRound(): void {
        if (this.currentRound === this.rounds
            && this.failureStrategies.length > Math.floor(0.1 * this.rounds)
        ) {
            this.log(LogPriority.Failure,
                `Failed ${this.failureStrategies.length} times ` +
                `over previous ${this.rounds} rounds. Total attempts ${this.attempt} played.` +
                'Failure strategies list follows.',
                this.failureStrategies
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
            .catch((e) => this.log(LogPriority.Error, 'Failed to initiate the game\'s new round', e));
    }

    private responseProcessor(data: WebSocket.Data): void
    {
        if (typeof data !== 'string') {
            this.log(LogPriority.Error, `Invalid typeof [${typeof data}] received from Game server`);

            return;
        }

        const response: GameServerResponseDto = new GameServerResponseDto(data);

        switch (response.type) {
            case GameServerResponseType.NewGame:
            case GameServerResponseType.TileCleared:
                this.getMap()
                    .catch((e) => this.log(LogPriority.Error, 'Failed to get the board disposition map', e));
                break;
            case GameServerResponseType.GotMap:
                if (! this.isFinalMap) {
                    this.log(LogPriority.Info, 'Game disposition', data);

                    let nextMove: ActionDto;
                    try {
                        nextMove = this.getPlay.getNextMove(new BoardDto(response.board));
                    } catch (e) {
                        const move: Move = new Move(this.roundHistory.length, data);
                        this.roundHistory.push(move);

                        this.log(LogPriority.Error, 'Play has throw an exception', e);
                        this.log(LogPriority.Failure, 'Replay of the entire game', this.roundHistory);

                        return;
                    }

                    const move: Move = new Move(this.roundHistory.length, data, nextMove);
                    this.roundHistory.push(move);

                    this.getOpen(nextMove)
                        .catch((e) => this.log(LogPriority.Error, 'Failed to open a new tile on board', e));
                } else {
                    this.isFinalMap = false;

                    this.log(LogPriority.Failure, 'Final failure disposition', data);
                    this.startRound();
                }
                break;
            case GameServerResponseType.GotMine:
                this.isFinalMap = true;
                this.log(
                    LogPriority.Failure,
                    `Failed. Attempt # ${this.attempt} ` +
                    `on ${this.getPlay.getBoardState.width} x ${this.getPlay.getBoardState.height} board.`
                );
                this.failureStrategies.push(this.roundHistory[this.roundHistory.length - 1].value.moveMethod);

                this.getMap()
                    .catch((e) => this.log(LogPriority.Error, 'Failed to get the board disposition map', e));
                break;
            case GameServerResponseType.Win:
                this.log(
                    LogPriority.Success,
                    `Level: ${this.level}. Password: ${response.password}. Attempts: ${this.attempt}. Mine count: ${this.getMines}.`
                );
                //this.startRound();
                break;
            default:
                this.log(LogPriority.Debug, 'A new message from Game-server received', data);
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
            await this.server.send(command);
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

    private initPlay(): void {
        this.play = new Play(new BinomialSetupDto(1000000, 100), this.getMines);
    }

    private get getMines(): number
    {
        if (typeof MinesPerLevel[this.level] !== 'undefined') {
            return MinesPerLevel[this.level];
        }

        const mineCount: number = Math.round(
            this.getPlay.getBoardState.height * this.getPlay.getBoardState.width * 0.35,
        ) - Math.floor(
            this.attempt / 10,
        );

        if (0 === this.attempt % 10) {
            this.log(LogPriority.Error, `Trying ${mineCount} mines ` +
                `on ${this.getPlay.getBoardState.width} x ${this.getPlay.getBoardState.height} board.`);
        }

        return mineCount;
    }

    private log(level: LogPriority, message: string, payload?: any): void {
        this.logger.log(new GameEventDto(level, message, payload));
    }
}
