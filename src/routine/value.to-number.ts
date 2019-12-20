export default function toNumber(value: any): number
{
    if (typeof value === 'undefined' || isNaN(value)) {
        return 1;
    }

    return Number(value);
}
