export const power10n = [ 1n, 10n, 100n, 1000n, 10000n, 100000n, 1000000n ];
export const power10 = [ 1, 10, 100, 1000, 10000, 100000, 1000000 ];

export default function bigintDivide(numerator: bigint, denominator: bigint, dp: number): number {
    return Number(numerator * power10n[dp] / denominator) / power10[dp];
}
