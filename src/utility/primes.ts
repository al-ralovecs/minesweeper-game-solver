export default class Primes implements IterableIterator<number>
{
    private readonly composite: boolean[];

    private index: number = 0;
    private stop: number;

    private nextPrime: number;

    public constructor(start: number, stop: number, composite: boolean[])
    {
        this.composite = composite;

        this.index = start;
        this.stop = stop;

        this.nextPrime = this.findNext;
    }


    [Symbol.iterator](): IterableIterator<number>
    {
        return this;
    }

    public next(): IteratorResult<number>
    {
        const result = this.nextPrime;
        this.nextPrime = this.findNext;

        return {
            done: false,
            value: result,
        };
    }

    private get findNext(): number
    {
        let next: number = -1;

        while (this.index <= stop && -1 === next) {
            if (! this.composite[this.index]) {
                next = this.index;
            }
            this.index++;
        }

        return next;
    }
}
