import LocationDto from './location.dto';
import whileLoopAroundTileDo from '../routine/while.loop-around-tile.do';

export default class AdjacentSquaresDto {
    private readonly location: LocationDto;
    private readonly height: number;
    private readonly width: number;
    private readonly size: number;

    public locations: LocationDto[] = [];

    public constructor(location: LocationDto, height: number, width: number, margin: number) {
        this.location = location;
        this.height = height;
        this.width = width;
        this.size = margin;

        this.init();
    }

    private init(): void {
        whileLoopAroundTileDo(
            this.location.y,
            this.location.x,
            this.height,
            this.width,
            (y, x, location) => {
                this.locations.push(location);
            },
            this.size,
        );
    }
}
