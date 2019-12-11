import Margin from '../Entity/Margin';
import countUnrevealedItemsAround from './board.item.countUnrevealedItemsAround';

export default function (
    model: boolean[][],
    data: number[][],
    height: number,
    width: number
): boolean[][] {
    for (let i: number = 0; i < height; i++) {
        for (let j: number = 0; j < width; j++) {

            if (1 > data[i][j]
                || countUnrevealedItemsAround(data, i, j, height, width) !== data[i][j]
            ) {
                continue;
            }

            const m: Margin = new Margin(i, j, height, width);

            for (let ii: number = i + m.top; ii <= i + m.bottom; ii++) {
                for (let jj: number = j + m.left; jj <= j + m.right; jj++) {
                    if (ii === i && jj == j) {
                        continue;
                    }
                    if (-1 === data[ii][jj]) {
                        model[ii][jj] = true;
                    }
                }
            }
        }
    }

    return model;
}
