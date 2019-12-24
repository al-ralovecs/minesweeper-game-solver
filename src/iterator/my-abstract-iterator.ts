import LocationDto from '../dto/location.dto';

export default abstract class MyAbstractIterator
{
    protected readonly numberBalls: number;
    protected readonly numberHoles: number;

    protected constructor(n: number, m: number)
    {
        this.numberBalls = n;
        this.numberHoles = m;
    }

    public get getBalls(): number
    {
        return this.numberBalls;
    }

    public get getHoles(): number
    {
        return this.numberHoles;
    }

    public getSampleAt(start: number): number[]
    {
        return undefined;
    }

    public getSample(): number[]
    {
        return this.getSampleAt(this.numberBalls - 1);
    }

    public witnessAlwaysSatisfied(location: LocationDto): boolean
    {
        return false;
    }
}
