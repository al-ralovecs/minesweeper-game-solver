export default class CoordinateDto {
    public readonly y: number;
    public readonly x: number;

    public constructor(y: number, x: number)
    {
        this.y = y;
        this.x = x;
    }

    public get value(): string
    {
        return `y=${this.y}&x=${this.x};`;
    }
}
