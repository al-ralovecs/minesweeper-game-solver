import { LogPriority } from '../enum/log.priority.enum';

export class GameEventDto {
    public prefix: string = '. Payload: ';

    constructor(public readonly level: LogPriority, public readonly message: string, public readonly payload?: any) {}

    public get toString(): string {
        const date: Date = new Date();

        const datePart =
            date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate() + ' ' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds();

        const priorityPart = ' [' + LogPriority[this.level] + ']';
        const messagePart = ' ' + this.message;
        const payloadPart = this.getPayloadParsed;

        return datePart + priorityPart + messagePart + payloadPart + '\n';
    }

    private get getPayloadParsed(): string {
        if (typeof this.payload === 'string') {
            return this.prefix + this.payload;
        }

        if (typeof this.payload === 'undefined') {
            return '';
        }

        if (null === this.payload) {
            return '';
        }

        try {
            return this.prefix + this.payload.toString();
        } catch (e) {
           //
        }

        return this.prefix + typeof this.payload;
    }
}
