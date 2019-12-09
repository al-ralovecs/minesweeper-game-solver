export default function (matrix: number[][]): boolean
{
    let width: number = matrix[0].length;

    for (let i: number = 0; i < matrix.length; i++) {
        if (matrix[i].length === width) {
            continue;
        }

        return false;
    }

    return true;
}
