import Margin from '../Entity/Margin';

export default function (
    model: boolean[][],
    y: number,
    x: number,
    height: number,
    width: number
): number {
    let count = 0;
    const m: Margin = new Margin(y, x, height, width);

    for (let i: number = y + m.top; i <= y + m.bottom; i++) {
        for (let j: number = x + m.left; j <= x + m.right; j++) {
            if (model[i][j]) {
                count++;
            }
        }
    }

    return count;
}
