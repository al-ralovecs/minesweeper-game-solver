import PrimeSieve from "./prime-sieve";

export default class Binomial
{
    private readonly max: number;
    private readonly ps: PrimeSieve;

    private binomialLookup: bigint[][];
    private lookupLimit: number;

    public constructor(max: number, lookup: number)
    {
        this.max = max;
        this.ps = new PrimeSieve(this.max);
        this.lookupLimit = (10 > lookup) ? 10 : lookup;

        const lookup2: number = Math.floor(lookup / 2);

        for (let i: number = 0; i <= this.lookupLimit + 1; i++) {
            this.binomialLookup[i] = [];

            for (let j: number = 0; j <= lookup2 + 1; j++) {
                this.binomialLookup[i][j] = undefined;
            }
        }

        for (let total: number = 1; total <= this.lookupLimit; total++) {
            for (let choose: number = 0; choose <= total / 2; choose++) {
                try {
                    this.binomialLookup[total][choose] = this.generate(choose, total);
                } catch (e) {

                }
            }
        }
    }

    private generate(choose: number, total: number): bigint
    {

    }
}

/**

 */