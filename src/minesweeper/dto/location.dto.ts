export default class LocationDto {
    public readonly y: number;
    public readonly x: number;

    public constructor(y: number, x: number) {
        this.y = y;
        this.x = x;
    }

    public get value(): string {
        return `y=${this.y}&x=${this.x};`;
    }

    public isAdjacent(target: LocationDto): boolean {
        const dy: number = Math.abs(this.y - target.y);
        const dx: number = Math.abs(this.x - target.x);

        return (! (1 < dy || 1 < dx || (0 === dy && 0 === dx)));
    }

    public equals(m: LocationDto): boolean {
        return this.y === m.y && this.x === m.x;
    }

    public get sortOrder(): number {
        return this.y + this.x * 10000;
    }
}
