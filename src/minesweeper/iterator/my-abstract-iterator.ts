import LocationDto from '../dto/location.dto';

export default abstract class MyAbstractIterator {
    public readonly ballsCount: number;
    public readonly holesCount: number;

    protected constructor(n: number, m: number) {
        this.ballsCount = n;
        this.holesCount = m;
    }

    public getSample(): number[] {
        return this.getSampleAt(this.ballsCount - 1);
    }

    public isWitnessAlwaysSatisfied(location: LocationDto): boolean {
        return false;
    }

    protected getSampleAt(start: number): number[] {
        return undefined;
    }
}
