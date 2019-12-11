export default function (y: number, x: number, height: number, width: number): number
{
    if ((
            0 === y
            && 0 === x
        )
        || (
            height - 1 === y
            && width - 1 === x
        )
    ) {
        return 3;
    }

    if (
        0 === y
        || 0 === x
        || height - 1 === y
        || width - 1 === x
    ) {
        return 5;
    }

    return 8;
}
