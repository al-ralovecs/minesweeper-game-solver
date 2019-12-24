/*
 * Used to hold a solution
 */
export default class ProbabilityLineDto
{
    public mineCount: number = 0;
    public solutionCount: bigint = 0n;
    public mineBoxCount: bigint[];

    public hashCount: number[];
    public hash: number = ProbabilityLineDto.getRandomHash;

    public constructor(boxCount: number)
    {
        this.mineBoxCount = new Array<bigint>(boxCount).fill(0n);
        this.hashCount = new Array<number>(boxCount).fill(0);
    }

    public static sortByMineCount(o1: ProbabilityLineDto, o2: ProbabilityLineDto): number
    {
        return o2.mineCount - o1.mineCount;
    }

    private static get getRandomHash(): number
    {
        // Java: new BigInteger(20                         , new Random())
        //                      2^20 - 1 = 1048575 ~ 10 ^ 6
        return Math.floor(Math.random() * Math.pow(10, 6));
    }
}
