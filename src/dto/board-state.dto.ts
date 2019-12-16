import ActionDto from "./action.dto";
import LocationDto from './location.dto';

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

    public livingWitnesses: LocationDto[] = [];

    public unPlayedMoves: number[];

    public constructor(height: number, width: number)
    {
        this.height = height;
        this.width = width;
    }

    public addLivingWitness(location: LocationDto): void
    {
        if (0 === this.livingWitnesses.filter(e => e.value === location.value).length) {
            this.livingWitnesses.push(location);
        }
    }

    public removeLivingWitnesses(toRemove: LocationDto[]): void
    {

    }
}
