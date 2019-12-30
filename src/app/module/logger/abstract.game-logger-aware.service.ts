import { LoggerService } from '@nestjs/common';
import { LogLevelEnum } from '../../enum/log.level.enum';
import { GameEventDto } from '../../dto/game.event.dto';

export abstract class AbstractGameLoggerAwareService {
    constructor(private readonly logger: LoggerService) {}

    protected debug(message: string, payload?: any): void {
        this.log(LogLevelEnum.Debug, message, payload);
    }

    protected info(message: string, payload?: any): void {
        this.log(LogLevelEnum.Info, message, payload);
    }

    protected error(message: string, payload?: any): void {
        this.log(LogLevelEnum.Error, message, payload);
    }

    protected failure(message: string, payload?: any): void {
        this.log(LogLevelEnum.Failure, message, payload);
    }

    protected success(message: string, payload?: any): void {
        this.log(LogLevelEnum.Success, message, payload);
    }

    private log(level: LogLevelEnum, message: string, payload?: any): void {
        this.logger.log(new GameEventDto(level, message, payload));
    }
}
