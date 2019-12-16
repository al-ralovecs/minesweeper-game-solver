import LocationDto from "./location.dto";
import {MarginDto} from "./margin.dto";

export class AdjacentSquaresDto {
    private readonly location: LocationDto;
    private readonly size: number;
    private readonly height: number;
    private readonly width: number;

    public locations: LocationDto[] = [];

    public constructor(location: LocationDto, height: number, width: number, size: number)
    {
        this.location = location;
        this.height = height;
        this.width = width;
        this.size = size;

        this.init();
    }

    private init(): void
    {
        const m: MarginDto = new MarginDto(this.location.y, this.location.x, this.height, this.width, this.size);

        for (let i: number = m.top; i <= m.bottom; i++) {
            for (let j: number = m.left; j <= m.right; j++) {
                if (i === this.location.y && j === this.location.x) {
                    continue;
                }

                this.locations.push(new LocationDto(i, j));
            }
        }
    }
}