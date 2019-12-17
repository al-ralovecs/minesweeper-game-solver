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
}
