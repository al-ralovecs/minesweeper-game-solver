import PrimeSieve from './prime-sieve';

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
        if (0 === k || k === n) {
            return 1n;
        }

        const n2: number = n / 2;

        if (k > n2) {
            k = n - k;
        }

        const nk: number = n - k;
        const rootN: number = Math.floor(Math.sqrt(n));
        let result: bigint = 1n;

        for (let prime: bigint of this.ps.getPrimesIterable(2, n)) {
            if (prime > nk) {
                result = result * BigInt(prime);
                continue;
            }

            if (prime > n2) {
                continue;
            }

            if (prime > rootN) {
                if (n % prime < k % prime) {
                    result = result * BigInt(prime);
                }
                continue;
            }

            let r: number = 0;
            let N: bigint = BigInt(n);
            let K: bigint = BigInt(k);
            let p: bigint = 1n;

            while (N > 0) {
                r = (N % prime) < (k % prime + r) ? 1 : 0;

                if (1 === r) {
                    p *= prime;
                }

                N /= prime;
                K /= prime;
            }

            if (1 < p) {
                result = result * BigInt(p);
            }
        }

        return result;
    }
}
