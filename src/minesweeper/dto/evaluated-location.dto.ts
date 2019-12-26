import LocationDto from './location.dto';

export default class EvaluatedLocationDto extends LocationDto {
    public readonly clearProbability: number;
    public readonly progressProbability: number;
    public readonly fixedClears: number;            // number of tiles which are clears
                                                    // regardless of what value is revealed
    public readonly isCorner: boolean;
    public expectedClears: number;

    public constructor(
        y: number,
        x: number,
        clearProbability: number,
        progressProbability: number,
        expectedClears: number,
        fixedClears: number,
        isCorner: boolean,
    ) {
        super(y, x);

        this.clearProbability = clearProbability;
        this.progressProbability = progressProbability;
        this.expectedClears = expectedClears;
        this.fixedClears = fixedClears;
        this.isCorner = isCorner;
    }

    public static sortByProgressProbability(o1: EvaluatedLocationDto, o2: EvaluatedLocationDto): number {
        if (0 !== o1.progressProbability - o2.progressProbability) {
            return - (o1.progressProbability - o2.progressProbability);
        }

        if (0 !== o1.expectedClears - o2.expectedClears) {
            return - (o1.expectedClears - o2.expectedClears);
        }

        if (o1.isCorner && ! o2.isCorner) {
            return 1;
        }

        if (! o1.isCorner && o2.isCorner) {
            return -1;
        }

        return 0;
    }

    public merge(link: EvaluatedLocationDto): void {
        this.expectedClears += link.expectedClears;
    }
}
