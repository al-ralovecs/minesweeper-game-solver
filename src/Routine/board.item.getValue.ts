import isCoordinatesValid from './board.coordinates.isValid';

const VALUE_FAIL = -10;

export default function (
    data: number[][],
    y: number,
    x: number,
    height: number,
    width: number
): number {
    if (isCoordinatesValid(y, x, height, width)) {
        return data[y][x];
    }

    return VALUE_FAIL;
}
