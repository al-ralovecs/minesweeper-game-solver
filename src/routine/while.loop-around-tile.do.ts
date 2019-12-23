import MarginDto from '../dto/margin.dto';

export default function whileLoopAroundTileDo(
    y: number,
    x: number,
    height: number,
    width: number,
    callable: (i: number, j: number) => void
) {
    const m: MarginDto = new MarginDto(y, x, height, width);

    for (let i: number = m.top; i <= m.bottom; i++) {
        for (let j: number = m.left; j <= m.right; j++) {
            if (i === y && j === x) {
                continue;
            }

            callable(i, j);
        }
    }
};
