import Rng64Kiss from '../../src/helper/rng-64-kiss';

describe('Rng64Kiss', () => {
    test('sequence of random values', () => {
        const rng: Rng64Kiss = new Rng64Kiss();

        rng.seed(1);

        expect(rng.random(32, 1)).toBe(15);
        expect(rng.random(32, 2)).toBe(14);
        expect(rng.random(32, 3)).toBe(11);
        expect(rng.random(32, 4)).toBe(25);
        expect(rng.random(32, 5)).toBe(16);
        expect(rng.random(32, 6)).toBe(4);
        expect(rng.random(32, 7)).toBe(12);
        expect(rng.random(32, 8)).toBe(28);
        expect(rng.random(32, 9)).toBe(2);
        expect(rng.random(32, 10)).toBe(12);
    });
});