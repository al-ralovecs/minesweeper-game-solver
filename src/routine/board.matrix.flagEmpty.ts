export default function (
    model: boolean[][],
    data: number[][],
    height: number,
    width: number
): boolean[][] {
    for (let i: number = 0; i < height; i++) {
        for (let j: number = 0; j < width; j++) {
            model[i][j] = 0 <= data[i][j];
        }
    }

    return model;
}
