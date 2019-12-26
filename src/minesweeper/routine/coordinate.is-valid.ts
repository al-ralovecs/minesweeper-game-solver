export default function isCoordinateValid(
    y: number,
    x: number,
    height: number,
    width: number,
): boolean {
    return 0 <= y && height > y && 0 <= x && width > x;
}
