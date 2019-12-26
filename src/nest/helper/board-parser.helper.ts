export class BoardParserHelper
{
    static parse(data: string): number[][]
    {
        return data.split('\n').map((row) => {
            let result: number[] = new Array<number>(row.length);

            for (let i: number = 0; i < row.length; i++) {
                const tile: string = row.charAt(i);

                if ('□' === tile) {
                    result[i] = -1;

                    continue;
                }

                result[i] = Number(tile);
            }

            return result;
        });
    }
}
