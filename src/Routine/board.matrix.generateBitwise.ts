export default function (height: number, width: number, value: boolean = false): boolean[][]
{
    let matrix: boolean[][] = [];

    for (let i = 0; i < height; i++) {
        let row: boolean[] = [];

        for (let j = 0; j < width; j++) {
            row.push(value);
        }

        matrix.push(row);
    }

    return matrix;
}
