import Rng64Kiss from '../../../src/helper/rand/rng-64-kiss';

describe('Rng64Kiss', () => {
    test('sequence of simple random values', () => {
        const rng: Rng64Kiss = new Rng64Kiss();

        rng.seed(1);

        expect(rng.random(32)).toBe(15);
        expect(rng.random(32)).toBe(14);
        expect(rng.random(32)).toBe(11);
        expect(rng.random(32)).toBe(25);
        expect(rng.random(32)).toBe(16);
        expect(rng.random(32)).toBe(4);
        expect(rng.random(32)).toBe(12);
        expect(rng.random(32)).toBe(28);
        expect(rng.random(32)).toBe(2);
        expect(rng.random(32)).toBe(20);
    });
    test('sequence of large random values', () => {
        const rng: Rng64Kiss = new Rng64Kiss();
        rng.seed(1);

        expect(rng.random(100000)).toBe(47368);
        expect(rng.random(100000)).toBe(43982);
        expect(rng.random(100000)).toBe(34879);
        expect(rng.random(100000)).toBe(79317);
        expect(rng.random(100000)).toBe(51704);
        expect(rng.random(100000)).toBe(15443);
        expect(rng.random(100000)).toBe(39943);
        expect(rng.random(100000)).toBe(89489);
        expect(rng.random(100000)).toBe(8868);
        expect(rng.random(100000)).toBe(63596);
        expect(rng.random(100000)).toBe(82427);
        expect(rng.random(100000)).toBe(6664);
        expect(rng.random(100000)).toBe(60082);
        expect(rng.random(100000)).toBe(58595);
        expect(rng.random(100000)).toBe(74193);
        expect(rng.random(100000)).toBe(82011);
        expect(rng.random(100000)).toBe(1223);
        expect(rng.random(100000)).toBe(13229);
        expect(rng.random(100000)).toBe(90289);
        expect(rng.random(100000)).toBe(76073);
    });
});
