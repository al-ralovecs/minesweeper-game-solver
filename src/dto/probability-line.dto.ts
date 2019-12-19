export default class ProbabilityLineDto
{
    public mineCount: number = 0;
    public solutionCount: bigint = 0n;
    public mineBoxCount: bigint[];

    public hashCount: bigint[];
    public hash: bigint = ProbabilityLineDto.getRandomHash;

    public static sortByMineCount(o1: ProbabilityLineDto, o2: ProbabilityLineDto): number
    {
        return o2.mineCount = o1.mineCount;
    }

    private static get getRandomHash(): bigint
    {
        return BigInt(Math.random() * Math.pow(10, 9));
    }
}

/**
 private class ProbabilityLine implements Comparable<ProbabilityLine> {
		private int mineCount = 0;
		private BigInteger solutionCount = BigInteger.ZERO;
		private BigInteger[] mineBoxCount  = new BigInteger[boxCount];

		private BigInteger[] hashCount  = new BigInteger[boxCount];
		private BigInteger hash = new BigInteger(20, new Random());

		{
			for (int i=0; i < mineBoxCount.length; i++) {
				mineBoxCount[i] = BigInteger.ZERO;
				hashCount[i] = BigInteger.ZERO;
			}
		}

		@Override
		// sort by the number of mines in the solution
		public int compareTo(ProbabilityLine o) {
			return this.mineCount - o.mineCount;
		}
	}
 */