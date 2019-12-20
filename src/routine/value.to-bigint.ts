export default function toBigInt(value: any): bigint
{
    if (typeof value === 'undefined') {
        return 1n;
    }

    return BigInt(value);
}
