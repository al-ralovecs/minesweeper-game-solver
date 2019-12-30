export class GameDirectiveDto
{
    command: string;
    count: number;

    constructor(directive: string)
    {
        this.parse(directive);
    }

    private parse(directive: string)
    {
        this.command = 'debug';
        this.count = null;

        switch (true) {
            case directive.includes('silent'):
                this.command = 'silent';
                return;
            case directive.includes('debug'):
                this.command = 'debug';
                return;
            case directive.includes('level'):
                this.command = 'level';
                this.count = 1;

                const countStr: string = directive.replace(/level/g,'').trim();

                if (0 === countStr.length) {
                    return;
                }

                const countNum: number = Math.round(Number(countStr));

                if (0 < countNum && 4 >= countNum) {
                    this.count = countNum;
                }
                return;
            case directive.includes('play'):
                this.command = 'play';
                this.count = 1;

                const count: string = directive.replace(/play/g,'').trim();

                if (0 !== count.length) {
                    this.count = Math.round(Number(count));
                }
                return;
            case directive.includes('stop'):
                this.command = 'stop';
                return;
            default:
                //
        }
    }
}
