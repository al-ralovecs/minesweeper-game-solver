import Coordinate from '../Entity/Coordinate';
import Board from '../Entity/Board';

export default function (borderItems: Coordinate[], board: Board): Coordinate[][] {
    let allRegions: Coordinate[][] = [];
    let coveredItems: Coordinate[] = [];

    while (true) {
        let queue: Coordinate[] = [];
        let finishedRegion: Coordinate[] = [];

        for (let t: number = 0; t < borderItems.length; t++) {
            if (0 === coveredItems.filter(e => e.value === borderItems[t].value).length) {
                queue.push(borderItems[t]);
                break;
            }
        }

        if (0 === queue.length) {
            break;
        }

        while (0 !== queue.length) {
            const currentItem: Coordinate = queue.pop();

            finishedRegion.push(currentItem);
            coveredItems.push(currentItem);

            for (let t: number = 0; t < borderItems.length; t++) {
                const investigatedItem: Coordinate = borderItems[t];
                let isConnected: boolean = false;

                if (0 !== finishedRegion.filter(e => e.value === investigatedItem.value).length) {
                    continue;
                }

                if (Math.abs(currentItem.y - investigatedItem.y) <= 2 || Math.abs(currentItem.x - investigatedItem.x) <= 2) {
                    itemSearch:
                        for (let i: number = 0; i < board.height; i++) {
                            for (let j: number = 0; j < board.width; j++) {
                                if (board.getValue(i, j) > 0
                                    && Math.abs(currentItem.y - i) <= 1
                                    && Math.abs(currentItem.x - j) <= 1
                                    && Math.abs(investigatedItem.y -i) <= 1
                                    && Math.abs(investigatedItem.x - j) <= 1
                                ) {
                                    isConnected = true;
                                    break itemSearch;
                                }
                            }
                        }

                    if (! isConnected) {
                        continue;
                    }

                    if (0 === queue.filter(e => e.value === investigatedItem.value).length) {
                        queue.push(investigatedItem);
                    }
                }
            }
        }

        allRegions.push(finishedRegion);
    }

    return allRegions;
}
