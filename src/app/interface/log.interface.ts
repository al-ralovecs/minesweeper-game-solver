import {LogPriority} from "../enum/log.priority.enum";

export interface LogInterface {
    (type: LogPriority, message: string, payload?: any): void
}
