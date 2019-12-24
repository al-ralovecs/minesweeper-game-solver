import MarginDto from '../dto/margin.dto';
import LocationDto from '../dto/location.dto';

export default function whileLoopAroundTileDo(
    y: number,
    x: number,
    height: number,
    width: number,
    callable: (i: number, j: number, location: LocationDto) => void,
    size: number = 1
) {
    const m: MarginDto = new MarginDto(y, x, height, width, size);

    for (let i: number = m.top; i <= m.bottom; i++) {
        for (let j: number = m.left; j <= m.right; j++) {
            if (i === y && j === x) {
                continue;
            }

            const location: LocationDto = new LocationDto(y, x);

            callable(i, j, location);
        }
    }
};
