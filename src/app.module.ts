import { Module } from '@nestjs/common';
import { GameModule } from './app/module/gateway/game.module';

@Module({
  imports: [GameModule],
})
export class AppModule {}
