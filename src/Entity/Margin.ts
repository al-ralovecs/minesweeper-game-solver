export default class Margin {
    public readonly top: number;
    public readonly bottom: number;
    public readonly left: number;
    public readonly right: number;

    public constructor(y: number, x: number, height: number, width: number)
    {
        this.top = 0 === y ? 0 : -1;
        this.bottom = height - 1 === y ? 0 : 1;
        this.left = 0 === x ? 0 : -1;
        this.right = width - 1 === j ? 0 : 1;
    }
}
