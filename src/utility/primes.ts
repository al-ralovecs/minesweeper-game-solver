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
            done: ! this.hasNext,
            value: result,
        };
    }

    public get hasNext(): boolean
    {
        return (-1 !== this.nextPrime);
    }

    private get findNext(): number
    {
        let next: number = -1;

        while (this.index <= this.stop && -1 === next) {
            if (! this.composite[this.index]) {
                next = this.index;
            }
            this.index++;
        }

        return next;
    }
}
