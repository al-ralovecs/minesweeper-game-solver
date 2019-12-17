export default class Primes
{
    private index: number = 0;
    private stop: number;
    private nextPrime: number;

    public constructor(start: number, stop: number)
    {
        this.index = start;
        this.stop = stop;
        this.nextPrime = this.findNext();
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

/**

 */