import { LogPriority } from '../enum/log.priority.enum';

export interface LoggerEventInterface {
    level: LogPriority;
    message: string;
    payload?: any;
}
