import isCoordinatesValid from './board.coordinates.isValid';

export default function (
    model: boolean[][],
    y: number,
    x: number,
    height: number,
    width: number
): boolean {
    if (isCoordinatesValid(y, x, height, width)) {
        return model[y][x];
    }

    throw Error();
}
