import isMatrixValid from '../routine/matrix.is-valid';

export default class BoardDto
{
    public data: number[][];

    public readonly height: number;
    public readonly width: number;

    public constructor(data: number[][])
    {
        if (! isMatrixValid(data)) {
            throw Error('[BoardDto] Provided two dimensional array does not represent a matrix');
        }

        this.data = data;

        this.height = data.length;
        this.width = data[0].length;
    }
}
