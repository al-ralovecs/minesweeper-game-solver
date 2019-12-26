import MyAbstractIterator from './my-abstract-iterator';

export default class SequentialIterator extends MyAbstractIterator {
    private sample: number[] = [];
    private more: boolean = true;
    private index: number;

    public constructor(n: number, m: number) {
        super(n, m);

        this.init();
    }

    private init(): void {
        this.index = this.ballsCount - 1;

        this.sample = new Array<number>(this.ballsCount);

        for (let i: number = 0; i < this.sample.length; i++) {
            this.sample[i] = i;
        }

        this.sample[this.index]--;
    }

    protected getSampleAt(start: number): number[] {
        if (! this.more) {
            return null;
        }

        this.index = start;

        this.sample[this.index]++;

        while (this.sample[this.index] >= this.holesCount - this.ballsCount + 1 + this.index) {
            if (0 === this.index) {
                this.more = false;
                return null;
            } else {
                this.index--;
                this.sample[this.index]++;
            }
        }

        while (this.index !== this.ballsCount - 1) {
            this.index++;
            this.sample[this.index] = this.sample[this.index - 1] + 1;
        }

        return this.sample;
    }
}
