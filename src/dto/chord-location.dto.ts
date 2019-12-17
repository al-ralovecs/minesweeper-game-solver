import LocationDto from './location.dto';

export default class ChordLocationDto extends LocationDto
{
    private readonly benefit: number;

    public constructor(y: number, x: number, benefit: number)
    {
        super(y, x);

        this.benefit = benefit;
    }

    public get getBenefit(): number
    {
        return this.benefit;
    }

    public static sortByBenefitDesc(o1: ChordLocationDto, o2: ChordLocationDto): number
    {
        return o2.benefit - o1.benefit;
    }
}
