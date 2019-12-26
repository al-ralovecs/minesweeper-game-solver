import LocationDto from './location.dto';

export default class CrunchResultDto {
    private square: LocationDto[];
    public witness: LocationDto[];

    public originalNumMines: number;

    public witnessGood: number[];
    public witnessRestFlags: boolean[];
    public witnessRestClear: boolean[];
    public currentFlags: number[];
    public alwaysSatisfied: boolean[];

    private weight: bigint;
    public bigGoodCandidates: bigint = BigInt(0);

    public bigTally: Array<bigint>;

    public bigDistribution: Array<Array<bigint>>;

    private bigCount: number[];
    private maxBigCount: number = 0;

    public get getSquare(): LocationDto[] {
        return this.square;
    }

    public set setSquare(square: LocationDto[]) {
        this.square = square;
    }
}
