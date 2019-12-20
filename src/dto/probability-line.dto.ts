export default class ProbabilityLineDto
{
    public mineCount: number = 0;
    public solutionCount: bigint = 0n;
    public mineBoxCount: bigint[] = [];

    public hashCount: bigint[] = [];
    public hash: bigint = ProbabilityLineDto.getRandomHash;

    public static sortByMineCount(o1: ProbabilityLineDto, o2: ProbabilityLineDto): number
    {
        return o2.mineCount - o1.mineCount;
    }

    public compareTo(o: ProbabilityLineDto): number
    {
        return this.mineCount - o.mineCount;
    }

    private static get getRandomHash(): bigint
    {
        // Java: new BigInteger(20                         , new Random())
        //                      2^20 - 1 = 1048575 ~ 10 ^ 6
        return BigInt(Math.floor(Math.random() * Math.pow(10, 6)));
    }
}
