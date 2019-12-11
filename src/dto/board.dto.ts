import isMatrixValid from '../routine/matrix.isValid';

export class BoardDto
{
    public exposed: number[][];

    public readonly height: number;
    public readonly width: number;

    public mines: number[][];
    public unexposed: number[][];
    public neighbors: number[][];
    public needed: number[][];

    public constructor(exposed: number[number][number])
    {
        if (! isMatrixValid(exposed)) {
            throw Error('[BoardDto] Provided two dimensional array does not represent a square');
        }

        this.exposed = exposed;

        this.height = exposed.length;
        this.width = exposed[0].length;
    }
}
