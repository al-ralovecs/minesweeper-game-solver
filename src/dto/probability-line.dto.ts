export default class ProbabilityLineDto
{
    public mineCount: number = 0;
    public solutionCount: number = 0;
    public mineBoxCount: number[] = [];

    public hashCount: number[] = [];
    public hash: number = ProbabilityLineDto.getRandomHash;

    public static sortByMineCount(o1: ProbabilityLineDto, o2: ProbabilityLineDto): number
    {
        return o2.mineCount - o1.mineCount;
    }

    public compareTo(o: ProbabilityLineDto): number
    {
        return this.mineCount - o.mineCount;
    }

    private static get getRandomHash(): number
    {
        // Java: new BigInteger(20                         , new Random())
        //                      2^20 - 1 = 1048575 ~ 10 ^ 6
        return Math.floor(Math.random() * Math.pow(10, 6));
    }
}
