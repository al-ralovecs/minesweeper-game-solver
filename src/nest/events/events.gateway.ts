import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameService } from '../game/game.service';
import { DirectiveDto } from '../dto/directive.dto';


@Injectable()
@WebSocketGateway({ upgrade: false, reconnection: true, forceNew: false })
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService: GameService) {}

    @SubscribeMessage('game')
    handleEvent(@MessageBody() directive: string): WsResponse<string> {

        const next: DirectiveDto = new DirectiveDto(directive);

        switch (next.command) {
            case 'silent':
                this.gameService.setSilent = true;
                break;
            case 'debug':
                this.gameService.setSilent = false;
                break;
            case 'level':
                this.gameService.setLevel = next.count;
                break;
            case 'play':
                this.gameService.setRounds = next.count;
                this.gameService.start();
                break;
            default:
                throw Error('Invalid directive provided');
        }

        return { event: "game", data: 'ok' };
    }
}
