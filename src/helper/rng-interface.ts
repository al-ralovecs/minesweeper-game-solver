export default interface RngInterface {
    seed(seed: number): void;
    random(n: number, step: number): number;
}
