import Primes from './primes';

export default class PrimeSieve
{
    private readonly composite: boolean[] = [];
    private readonly max: number;

    public constructor(n: number)
    {
        this.max = (2 > n) ? 2 : n;

        for (let i: number = 0; i <= this.max + 1; i++) {
            this.composite[i] = false;
        }

        const rootN: number = Math.floor(Math.sqrt(n));

        for (let i: number = 2; i < rootN; i++) {
            if (this.composite[i]) {
                continue;
            }

            let index: number = i + 1;

            while (index <= this.max) {
                this.composite[index] = true;
                index = index + i;
            }
        }
    }

    public isPrime(n: number): boolean
    {
        if (1 >= n || this.max < n) {
            throw Error(`[PrimeSieve] Test value [${n}] is out of range [2..${this.max}]`);
        }

        return ! this.composite[n];
    }

    public getPrimesIterable(start: number, stop: number): Iterable<number>
    {
        if (start > stop) {
            throw Error(`[PrimeSieve] Start [${start}] must be less or equal to stop [${stop}]`);
        }

        if (1 >= start || this.max < start) {
            throw Error(`[PrimeSieve] Start [${start}] value is out of range of [2..${this.max}]`);
        }

        if (1 >= stop || this.max < stop) {
            throw Error(`[PrimerSieve] Stop [${stop}] value is out of range of [2..${this.max}]`);
        }

        return new Primes(start, stop, this.composite);
    }
}
