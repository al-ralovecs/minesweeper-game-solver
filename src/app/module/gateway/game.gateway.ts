import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { GameDirectiveDto } from '../../dto/game-directive.dto';
import { GameEventDto } from '../../dto/game.event.dto';
import { LoggerService } from '@nestjs/common';
import { LogLevelEnum } from '../../enum/log.level.enum';

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
        const directiveDto: GameDirectiveDto = new GameDirectiveDto(directive);

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
                    return this.sendMessage('logger', 'Error: ' + e);
                }
                break;
            case 'stop':
                //
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
        if (! this.isDebug && (message instanceof GameEventDto && LogLevelEnum.Error > message.level)){
            return;
        }

        if (message instanceof GameEventDto) {
            this.sendMessage('logger', message.toString);
        }

        if (typeof message === 'string') {
            this.sendMessage('logger', message);
        }
    }

    error(message: any, trace?: string, context?: string): void {
        //
    }

    warn(message: any, context?: string): void {
        //
    }

    private runGame(rounds: number): void
    {
        this.gameService = new GameService(this);
        this.gameService.setLevel = this.gameLevel;
        this.gameService.setRounds = rounds;

        try {
            this.gameService.playMinesweeper();
        } catch (e) {
            this.log('GameService has thrown an exception: ' + (typeof e === 'string' ? e : ''));
        } finally {
            this.gameService = null;
        }
    }

    private sendMessage(channel: string, message: string) {
        this.server.emit(channel, message);
    }
}
