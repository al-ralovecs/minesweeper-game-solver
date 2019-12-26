export const power10n = [
    BigInt(1),
    BigInt(10),
    BigInt(100),
    BigInt(1000),
    BigInt(10000),
    BigInt(100000),
    BigInt(1000000),
];
export const power10 = [ 1, 10, 100, 1000, 10000, 100000, 1000000 ];

export default function bigintDivide(numerator: bigint, denominator: bigint, dp: number): number {
    return Number(numerator * power10n[dp] / denominator) / power10[dp];
}
