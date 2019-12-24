import PrimeSieve from './prime-sieve';

export default class Binomial
{
    private readonly lookupLimit: number;
    private readonly max: number;
    private readonly ps: PrimeSieve;

    private binomialLookup: bigint[][] = [];

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

    public getCombination(choose: number, total: number): bigint
    {
        try {
            return this.generate(choose, total);
        } catch (e) {
            return 1n;
        }
    }

    private generate(k: number, n: number): bigint
    {
        if (0 === k && 0 === n) {
            return 1n;
        }

        if (1 > n || this.max < n) {
            throw Error(`[Binomial] Value n = ${n} failed its constraints [1..${this.max}]`);
        }

        if (0 > k || k > n) {
            throw Error(`[Binomial] Value k = ${k} failed its constraints [0..${n}]`);
        }

        let choose: number = Math.min(k, n-k);

        if (n <= this.lookupLimit && typeof this.binomialLookup[n][choose] !== 'undefined') {
            return this.binomialLookup[n][choose];
        }

        if (150 > choose) {
            return Binomial.combination(choose, n);
        }

        return this.combinationLarge(choose, n);
    }

    private static combination(mines: number, squares: number): bigint
    {
        let top: bigint = 1n;
        let bottom: bigint = 1n;

        let range: number = Math.min(mines, squares - mines);

        for (let i: number = 0; i < range; i++) {
            top = top * BigInt(squares - i);
            bottom = bottom * BigInt(i + 1);
        }

        return top / bottom;
    }

    private combinationLarge(k: number, n: number): bigint
    {
        let kk = BigInt(k);
        let nn = BigInt(n);


        if (0n === kk || kk === nn) {
            return 1n;
        }

        const n2: bigint = nn / 2n;

        if (kk > n2) {
            kk = nn - kk;
        }

        const nk: bigint = nn - kk;
        const rootN: bigint = BigInt(Math.floor(Math.sqrt(n)));
        let result: bigint = 1n;

        for (let prime of this.ps.getPrimesIterable(2, n)) {
            const biPrime = BigInt(prime);

            if (biPrime > nk) {
                result = result * biPrime;
                continue;
            }

            if (biPrime > n2) {
                continue;
            }

            if (biPrime > rootN) {
                if (nn % biPrime < kk % biPrime) {
                    result = result * biPrime;
                }
                continue;
            }

            let r: number = 0;
            let N: bigint = BigInt(n);
            let K: bigint = BigInt(k);
            let p: bigint = 1n;

            while (N > 0) {
                r = (N % biPrime) < (k % prime + r) ? 1 : 0;

                if (1 === r) {
                    p *= biPrime;
                }

                N /= biPrime;
                K /= biPrime;
            }

            if (1 < p) {
                result = result * p;
            }
        }

        return result;
    }
}
