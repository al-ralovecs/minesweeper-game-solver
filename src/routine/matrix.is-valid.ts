export default function matrixIsValid(matrix: any[][]): boolean {
    const width: number = matrix[0].length;

    for (const row of matrix) {
        if (row.length === width) {
            continue;
        }

        return false;
    }

    return true;
}
