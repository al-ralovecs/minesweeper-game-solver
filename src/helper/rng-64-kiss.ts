import RngInterface from './rng-interface';

// export default class Rng64Kiss implements RngInterface
// {
//     private kiss64_x: number = 1234567890987654321;
//     private kiss64_c: number = 123456123456123456;
//     private kiss64_y: number = 362436362436362436;
//     private kiss64_z: number = 1066149217761810;
//     private kiss64_t: number = 0;
//
//     public seed(seed: number): void
//     {
//         this.kiss64_x = seed | 1;
//         this.kiss64_c = seed | 2;
//         this.kiss64_y = seed | 4;
//         this.kiss64_z = seed | 8;
//         this.kiss64_t = 0;
//     }
//
//     public random(n: number): number
//     {
//         this.echo('before');
//         this.kiss64_t = (this.kiss64_x << 58) + this.kiss64_c;
//         this.echo('after step 1');
//         this.kiss64_c = (this.kiss64_x >>> 6);
//         this.echo('after step 2');
//         this.kiss64_x += this.kiss64_t;
//         this.echo('after step 3');
//
//         this.kiss64_c += this.unsignedLessThan(this.kiss64_x, this.kiss64_t) ? 1 : 0;
//         this.echo('after step 4');
//
//         this.kiss64_y ^= (this.kiss64_y << 13);
//         this.echo('after step 5');
//         this.kiss64_y ^= (this.kiss64_y >>> 17);
//         this.echo('after step 6');
//         this.kiss64_y ^= (this.kiss64_y << 43);
//         this.echo('after step 7');
//
//         this.kiss64_z = 6906969069 * this.kiss64_z + 1234567;
//         this.echo('after step 8');
//
//         const rand: number = this.kiss64_x + this.kiss64_y + this.kiss64_z;
//         this.echo('after step 9; rand = ' + rand);
//
//         if (n === 0) {
//             return rand;
//         } else {
//             return ((rand & 0xFFFFFFFF) * n) >>> 32;
//         }
//     }
//
//     private unsignedLessThan(a: number, b: number): boolean
//     {
//         return (a < b);
//     }
//
//     private echo(log: string): void
//     {
//         console.log("[" + log + "] kiss64_x = " + this.kiss64_x + "; kiss64_c = " + this.kiss64_c + "; kiss64_y = " + this.kiss64_y + "; kiss64_z = " + this.kiss64_z + "; kiss64_t = " + this.kiss64_t + ".");
//     }
// }



export default class Rng64Kiss implements RngInterface
{
    private kiss64_x: bigint = 1234567890987654321n;
    private kiss64_c: bigint = 123456123456123456n;
    private kiss64_y: bigint = 362436362436362436n;
    private kiss64_z: bigint = 1066149217761810n;
    private kiss64_t: bigint = 0n;

    public seed(seed: number): void
    {
        const biSeed = BigInt(seed);

        this.kiss64_x = biSeed | 1n;
        this.kiss64_c = biSeed | 2n;
        this.kiss64_y = biSeed | 4n;
        this.kiss64_z = biSeed | 8n;
        this.kiss64_t = 0n;
    }

    public random(n: number, step: number): number
    {
        this.echo('before; step = ' + step);
        this.kiss64_t = BigInt.asIntN(64, (this.kiss64_x << BigInt(58)) + this.kiss64_c);
        this.echo('after step 1');
        this.kiss64_c = (this.kiss64_x >> 6n);
        this.echo('after step 2');
        this.kiss64_x += this.kiss64_t;
        this.echo('after step 3');

        this.kiss64_c += this.unsignedLessThan(this.kiss64_x, this.kiss64_t) ? 1n : 0n;
        this.echo('after step 4');

        this.kiss64_y ^= BigInt.asIntN(64, (this.kiss64_y << 13n));
        this.echo('after step 5');
        this.kiss64_y ^= BigInt.asUintN(64, (this.kiss64_y >> BigInt(17)));
        this.echo('after step 6');
        this.kiss64_y ^= BigInt.asIntN(64, (this.kiss64_y << 43n));
        this.echo('after step 7');

        this.kiss64_z = BigInt.asIntN(64, 6906969069n * this.kiss64_z + 1234567n);
        this.echo('after step 8');

        const rand: bigint = this.kiss64_x + this.kiss64_y + this.kiss64_z;
        this.echo('after step 9; rand = ' + rand);

        if (n === 0) {
            return Number(rand);
        } else {
            return Number(((rand & 0xFFFFFFFFn) * BigInt(n)) >> 32n);
        }
    }

    private unsignedLessThan(a: bigint, b: bigint): boolean
    {
        return Boolean((a < b) ^ (a < 0) ^ (b < 0));
    }

    private echo(log: string): void
    {
        console.log("[" + log + "] kiss64_x = " + this.kiss64_x + "; kiss64_c = " + this.kiss64_c + "; kiss64_y = " + this.kiss64_y + "; kiss64_z = " + this.kiss64_z + "; kiss64_t = " + this.kiss64_t + ".");
    }
}
