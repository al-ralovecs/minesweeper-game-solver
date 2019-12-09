import Board from "../Entity/Board";
import Coordinate from "../Entity/Coordinate";

export default function (board: Board): Coordinate[]
{
    let region: Coordinate[] = [];

    for (let i = 0; i < board.height; i++) {
        for (let j = 0; j < board.width; j++) {
            if (board.getIsBoundary(i, j) && ! board.getIsMine(i, j)) {
                region.push(new Coordinate(i, j));
            }
        }
    }

    return region;
}
