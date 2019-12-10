export default function (perimeterSolutionStat: object[], totalMines: number, minesRemaining: number) {
    let bTotalNumberOfSolutions: bigint;
    const bTotalMines: bigint = BigInt(totalMines);

    for(let i: number = 0; i < perimeterSolutionStat.length; i++) {
        Object.keys(perimeterSolutionStat[i]).forEach((j: string) => {
            const minesPerSolution1: number = Number(j);
            const bSolutionCount1: bigint = BigInt(perimeterSolutionStat[i][j]);

            for (let ii: number = 0; ii < perimeterSolutionStat.length; ii++) {
                Object.keys(perimeterSolutionStat[i]).forEach((jj: string) => {
                    if (i === ii) {
                        return;
                    }

                    const minesPerSolution2: number = Number(jj);
                    const bSolutionCount2: bigint = BigInt(perimeterSolutionStat[ii][jj]);


                })
            }


        });
    }
}