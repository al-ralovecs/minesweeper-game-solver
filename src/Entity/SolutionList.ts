import isValid from '../Routine/matrix.isValid';

export default class SolutionList {
    private data: boolean[][];

    private sExists: boolean;
    private sIndex: number;
    private sType: boolean;

    private solutionNumberPerMinesCount: object[];

    public add(solution: boolean[]): void
    {
        this.data.push(solution);
    }

    public get count(): number
    {
        return this.data.length;
    }

    public get index(): number
    {
        return this.sIndex;
    }

    public get type(): boolean
    {
        return this.sType;
    }

    public get solutionNumberPerMinesCount(): number[number][]
    {
        return this.solutionNumberPerMinesCount;
    }

    public get exists(): boolean
    {
        if (! isValid(this.data)) {
            throw Error();
        }

        this.sExists = false;

        for (let i: number = 0; i < this.data[0].length; i++) {
            let allMine: boolean = true;
            let allEmpty: boolean = true;

            for (let j: number = 0; j < this.data.length; j++) {
                if (! this.data[j][i]) {
                    allMine = false;
                }
                if (this.data[j][i]) {
                    allEmpty = false;
                }
            }

            if (allMine || allEmpty) {
                this.sExists = true;
                this.sIndex = i;

                if (allMine) {
                    this.sType = true;
                }
                if (allEmpty) {
                    this.sType = false;
                }

                break;
            }
        }

        return this.sExists;
    }

    public get getHighestEmptyItemProbability(): number
    {
        let maxEmpty: number = -1;
        let indexEmpty: number = -1;

        for (let i: number = 0; i < this.data.length; i++) {
            let appearedEmpty: number = 0;

            for (let j: number = 0; j < this.data[0].length; j++) {
                if (! this.data[j][i]) {
                    appearedEmpty++;
                }
            }

            if (appearedEmpty > maxEmpty) {
                maxEmpty = appearedEmpty;
                indexEmpty = i;
            }
        }

        this.sType = false;
        this.sIndex = indexEmpty;

        return maxEmpty / this.data.length;
    }

    public aggregateStatistics(): void
    {
        let solutionNumberPerMinesCount: object;
        for (let i: number = 0; i < this.data.length; i++) {
            let minesPerSolution: number = 0;

            for (let j: number = 0; j < this.data[0].length; j++) {
                if (this.data[i][j]) {
                    minesPerSolution++;
                }
            }

            let solutionCount: number = solutionNumberPerMinesCount[minesPerSolution] === 'undefined'
                ? 1
                : solutionNumberPerMinesCount[minesPerSolution]++,

            solutionNumberPerMinesCount = {
              ...solutionNumberPerMinesCount,
              [minesPerSolution]: solutionCount,
            };
        }

        this.solutionNumberPerMinesCount.push(solutionNumberPerMinesCount);
    }
}
