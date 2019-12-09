import Margin from '../Entity/Margin';
import isCoordinatesValid from './board.coordinates.isValid';

export default function (
    data: number[][],
    y: number,
    x: number,
    height: number,
    width: number
): boolean {
    if (! isCoordinatesValid(y, x, height, width)) {
        return false;
    }

    if (-1 !== data[y][x]) {
        return false;
    }

    const m: Margin = new Margin(y, x, height, width);

    for (let i: number = y + m.top; i <= y + m.bottom; i++) {
        for (let j: number = x + m.left; j <= x + m.right; j++) {
            if (0 <= data[i][j]) {
                return true;
            }
        }
    }

    return false;
}
