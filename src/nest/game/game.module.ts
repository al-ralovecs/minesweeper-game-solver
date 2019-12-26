import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { EventsGateway } from '../events/events.gateway';

@Module({
    providers: [GameService, EventsGateway],
    exports: [GameService]
})
export class GameModule {}
