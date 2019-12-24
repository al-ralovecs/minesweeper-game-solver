import LocationDto from './location.dto';
import whileLoopAroundTileDo from '../routine/while.loop-around-tile.do';

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
        whileLoopAroundTileDo(this.location.y, this.location.x, this.height, this.width, (y, x, location) => {
            this.locations.push(location);
        }, this.size);
    }
}