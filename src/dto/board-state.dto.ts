import ActionDto from "./action.dto";
import LocationDto from './location.dto';
import LocationSetDto from "./location-set.dto";
import AreaDto from "./area.dto";
import {AdjacentSquaresDto} from "./adjacent-squares.dto";

export default class BoardStateDto
{
    public readonly height: number;
    public readonly width: number;

    public totalFlags: number = 0;
    public totalFlagsConfirmed: number = 0;
    public numOfHidden: number = 0;

    public flagConfirmed: boolean[][];
    public adjFlagsConfirmed: number[][];
    public adjUnrevealed: number[][];
    public revealed: boolean[][];
    public board: number[][];

    public flagOnBoard: boolean[][];
    public adjFlagsOnBoard: number[][];

    public action: ActionDto[][];
    public actionList: ActionDto[];

    public livingWitnesses: LocationSetDto;

    public adjacentLocations1: AdjacentSquaresDto[][];
    public adjacentLocations2: AdjacentSquaresDto[][];

    public unPlayedMoves: number[];

    public constructor(height: number, width: number)
    {
        this.height = height;
        this.width = width;
    }

    public get getTotalUnrevealedCount(): number
    {
        return this.numOfHidden;
    }

    public get getAllLivingWitnesses(): LocationDto[]
    {
        return this.livingWitnesses.data;
    }

    public countAdjacentUnrevealed(location: LocationDto): number
    {
        return this.adjUnrevealed[location.y][location.x];
    }

    public getUnrevealedArea(witnesses: LocationDto[]): AreaDto
    {
        return new AreaDto(this.getUnrevealedSquaresDo(witnesses));
    }

    private getUnrevealedSquaresDo(witnesses: LocationDto[]): LocationSetDto
    {
        let work: LocationSetDto = new LocationSetDto();

        witnesses.forEach(l => {
            this.getAdjacentSquaresIterable(l).forEach(adj => {
                if (this.isUnrevealed(adj)) {
                    work.add(adj);
                }
            })
        });

        return work;
    }

    private isUnrevealed(location: LocationDto): boolean
    {
        return ! this.flagConfirmed[location.y][location.x] && ! this.revealed[location.y][location.x];
    }

    private getAdjacentSquaresIterable(location: LocationDto): LocationDto[]
    {
        if (undefined === this.adjacentLocations1[location.y][location.x]) {
            this.adjacentLocations1[location.y][location.x] = new AdjacentSquaresDto(
                location,
                this.height,
                this.width,
                1
            );
        }

        return this.adjacentLocations1[location.y][location.x].locations;
    }
}
