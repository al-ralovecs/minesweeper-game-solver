import RngInterface from './rng-interface';

const value_IntN = 64;

function asIntN(val: bigint) {
    return BigInt.asIntN(value_IntN, val);
}

export default class Rng64Kiss implements RngInterface
{
    private kiss64_x: bigint = 1234567890987654321n;
    private kiss64_c: bigint = 123456123456123456n;
    private kiss64_y: bigint = 362436362436362436n;
    private kiss64_z: bigint = 1066149217761810n;
    private kiss64_t: bigint = 0n;

    public seed(seed: number): void
    {
        const _seed: bigint = BigInt(seed);

        this.kiss64_x = _seed | 1n;
        this.kiss64_c = _seed | 2n;
        this.kiss64_y = _seed | 4n;
        this.kiss64_z = _seed | 8n;
        this.kiss64_t = 0n;
    }

    public random(n: number): number
    {
        this.kiss64_t = asIntN((this.kiss64_x << 58n) + this.kiss64_c);
        this.kiss64_c = (this.kiss64_x >> 6n);
        this.kiss64_x += this.kiss64_t;

        this.kiss64_c += Rng64Kiss.unsignedLessThan(this.kiss64_x, this.kiss64_t) ? 1n : 0n;

        this.kiss64_y ^= asIntN(this.kiss64_y << 13n);
        this.kiss64_y ^= Rng64Kiss.unsignedRightShift(this.kiss64_y,  64n,17n);
        this.kiss64_y ^= asIntN(this.kiss64_y << 43n);

        this.kiss64_z = asIntN(6906969069n * this.kiss64_z + 1234567n);
        const rand: bigint = this.kiss64_x + this.kiss64_y + this.kiss64_z;

        if (n === 0) {
            return Number(rand);
        } else {
            return Number(((rand & 0xFFFFFFFFn) * BigInt(n)) >> 32n);
        }
    }

    /**
     * @see https://stackoverflow.com/questions/1411006/how-do-i-compare-two-longs-as-unsigned-in-java
     *
     * @param a
     * @param b
     */
    private static unsignedLessThan(a: bigint, b: bigint): boolean
    {
        return Boolean((a < b) ^ (a < 0) ^ (b < 0));
    }

    /**
     * @see https://stackoverflow.com/questions/5281852/biginteger-unsigned-left-or-right-shift
     *
     * @param val
     * @param width
     * @param shiftBy
     */
    private static unsignedRightShift(val: bigint, width: bigint, shiftBy: bigint): bigint
    {
        if (0 <= val) {
            return val >> shiftBy;
        }

        const opener: bigint = 1n << (width + 1n);
        const opened: bigint = val - opener;
        const mask: bigint = (opener - 1n) >> (shiftBy + 1n);

        return (opened >> shiftBy) & mask;
    }
}
