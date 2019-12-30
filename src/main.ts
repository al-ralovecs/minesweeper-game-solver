import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from '@nestjs/common';
import { GameGateway } from './app/module/gateway/game.gateway';
import { config } from './config/config.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.useLogger(app.get<LoggerService>(GameGateway));
  await app.listen(config.listen_port);
}
bootstrap();
