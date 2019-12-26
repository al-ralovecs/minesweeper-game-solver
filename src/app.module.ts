import { Module } from '@nestjs/common';
import { GameModule } from './nest/game/game.module';
import { EventsModule } from './nest/events/events.module';

@Module({
  imports: [EventsModule, GameModule],
})
export class AppModule {}
