import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { DirectiveDto } from '../../dto/directive.dto';
import { GameEventDto } from '../../dto/game.event.dto';
import { LoggerService } from "@nestjs/common";
import {LogPriority} from "../../enum/log.priority.enum";

@WebSocketGateway()
export class GameGateway implements LoggerService {
    @WebSocketServer()
    server: Server;
    private gameService: GameService;
    // user settings for game process
    private isDebug: boolean = true;
    private gameLevel: number = 1;

    @SubscribeMessage('game')
    async handleGame(@MessageBody() directive: string) {
        const directiveDto: DirectiveDto = new DirectiveDto(directive);

        switch (directiveDto.command) {
            case 'silent':
                this.isDebug = false;
                break;
            case 'debug':
                this.isDebug = true;
                break;
            case 'level':
                this.gameLevel = directiveDto.count;
                break;
            case 'play':
                try {
                    this.runGame(directiveDto.count);
                } catch (e) {
                    this.sendMessage('logger', 'Error: ' + e);
                }
                break;
            default:
                return this.sendMessage('game', 'unrecognized directive: ' + directive);
        }

        this.sendMessage(
            'game',
            directiveDto.command + ': ok. ' +
            'Status: ' +
            '[debug] = ' + (this.isDebug ? 'on' : 'off') + ', ' +
            '[level] = ' + this.gameLevel
        );
    }

    public log(message: any): void
    {
        if (! this.isDebug || (message instanceof GameEventDto && LogPriority.Error > message.level)){
            return;
        }

        if (message instanceof GameEventDto) {
            this.sendMessage('logger', message.toString);
        }

        if (message instanceof Array) {
            message.forEach((m) => {
                if (typeof m === 'string') {
                    this.sendMessage('logger', m);
                }
                if (typeof m === 'object') {
                    this.sendMessage('logger', m.toString());
                }
            })
        }

        if (typeof message === 'string') {
            this.sendMessage('logger', message);
        }
    }

    error(message: any, trace?: string, context?: string): any {
        if (message instanceof GameEventDto) {
            this.sendMessage('logger', message.toString);
        }

        if (typeof message === 'string') {
            this.sendMessage('logger', message);
        }
    }

    warn(message: any, context?: string): any {
        if (message instanceof GameEventDto) {
            this.sendMessage('logger', message.toString);
        }
    }

    private runGame(rounds: number): void
    {
        this.gameService = new GameService(this);
        this.gameService.setLevel = this.gameLevel;
        this.gameService.setRounds = rounds;

        try {
            this.gameService.playMinesweeper();
        } catch (e) {
            this.error('GameService has thrown an exception: ' + e);
        } finally {
            this.gameService = null;
        }
    }

    private sendMessage(channel: string, message: string) {
        this.server.emit(channel, message);
    }
}
