export class LogPayloadParserHelper {
    static parse(prefix: string, payload: any): string {
        if (typeof payload === 'string') {
            return prefix + payload;
        }

        if (typeof payload === 'undefined') {
            return '';
        }

        if (null === payload) {
            return '';
        }

        try {
            return prefix + payload.toString();
        } catch (e) {
            //
        }

        return prefix + typeof payload;
    }
}
