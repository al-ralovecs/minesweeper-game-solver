export default function (model: boolean[][], height: number, width: number): number
{
    let count: number = 0;

    for (let i: number = 0; i < height; i++) {
        for (let j: number = 0; j < width; j++) {
            if (model[i][j]) {
                count++;
            }
        }
    }

    return count;
}
