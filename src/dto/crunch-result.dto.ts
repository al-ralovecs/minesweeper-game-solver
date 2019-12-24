import LocationDto from './location.dto';

export default class CrunchResultDto
{
    private square: LocationDto[];
    public witness: LocationDto[];

    public originalNumMines: number;

    public witnessGood: number[];
    public witnessRestFlags: boolean[];
    public witnessRestClear: boolean[];
    public currentFlags: number[];
    public alwaysSatisfied: boolean[];

    private weight: bigint;
    public bigGoodCandidates: bigint = 0n;

    public bigTally: bigint[];

    public bigDistribution: bigint[][];

    private bigCount: number[];
    private maxBigCount: number = 0;

    public get getSquare(): LocationDto[]
    {
        return this.square;
    }

    public set setSquare(square: LocationDto[])
    {
        this.square = square;
    }
}

/**

 */