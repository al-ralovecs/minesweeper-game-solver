export default class MarginDto {
    public readonly top: number;
    public readonly bottom: number;
    public readonly left: number;
    public readonly right: number;

    public readonly size: number;

    public constructor(y: number, x: number, height: number, width: number, size: number = 1) {
        this.size = size;

        this.top = Math.max(0, y - size);
        this.bottom = Math.min(height - 1, y + size);

        this.left = Math.max(0, x - size);
        this.right = Math.min(width - 1, x + size);
    }
}
