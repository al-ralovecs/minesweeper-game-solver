import SolutionDto from './solution.dto';

export default class SolutionTableDto
{
    private data: SolutionDto[];
    private readonly maxSize: number;

    public size: number = 0;

    public constructor(maxSize: number)
    {
        this.maxSize = maxSize;
    }

    public add(solution: SolutionDto): number
    {
        const size: number = this.size;

        this.data[size] = solution;
        this.size++;

        return size;
    }

    public get(index: number): SolutionDto
    {
        if (0 <= index && this.size > index) {
            return this.data[index];
        }

        throw Error(`[SolutionTable] Cannot get solution [${index}], because it is out of current solution table [0..${this.size}]`);
    }
}
