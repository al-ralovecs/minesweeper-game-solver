import LocationDto from './location.dto';
import { StrategyType } from '../strategy/abstract-strategy';
import ActionDto, { ActionType } from './action.dto';

export default class CandidateLocationDto extends LocationDto
{
    public readonly probability: number;
    public readonly adjSquares: number;
    public readonly adjFlags: number;
    public readonly count: number; // the number of different values this square can be (other than a mine)

    public constructor(
        y: number,
        x: number,
        probability: number,
        adjSquares: number,
        adjFlags: number,
        count: number = 0
    ) {
        super(y, x);

        this.probability = probability;
        this.adjSquares = adjSquares;
        this.adjFlags = adjFlags;
        this.count = count;
    }

    public buildAction(moveMethod: StrategyType): ActionDto
    {
        return new ActionDto(
            new LocationDto(this.y, this.x),
            ActionType.Clear,
            moveMethod,
            this.probability
        );
    }

    /**
     * This sorts
     * by highest probability of not being a mine,
     * then the number of adjacent flags,
     * unrevealed squares,
     * and finally location order
     *
     * @param o1 CandidateLocationDto
     * @param o2 CandidateLocationDto
     */
    public static sortByProbabilityFlagFree(o1: CandidateLocationDto, o2: CandidateLocationDto): number
    {
        // highest probability first
        if (0 !== o1.probability - o2.probability) {
            return -(o1.probability - o2.probability);
        }

        // number of different values this square can be
        if (0 !== o1.count - o2.count) {
            return -(o1.count - o2.count);
        }

        // highest number of flags
        if (0 !== o1.adjFlags - o2.adjFlags) {
            return -(o1.adjFlags - o2.adjFlags);
        }

        // lowest adjacent free squares
        if (0 !== o1.adjSquares - o2.adjSquares) {
            return o1.adjSquares - o2.adjSquares;
        }

        // location order
        return o1.sortOrder - o2.sortOrder;
    }

    /**
     * This sorts
     * by highest probability of not being a mine
     * then the number unrevealed squares (lowest first),
     * then of adjacent flags (highest first),
     * and finally location order
     *
     * @param o1 CandidateLocationDto
     * @param o2 CandidateLocationDto
     */
    public static sortByProbabilityFreeFlag(o1: CandidateLocationDto, o2: CandidateLocationDto): number
    {
        // highest probability first
        if (0 !== o1.probability - o2.probability) {
            return -(o1.probability - o2.probability);
        }

        // lowest adjacent free squares
        // except zero treated as 9
        if (0 !== CandidateLocationDto.getZeroBiasedAdjSquares(o1.adjSquares) - CandidateLocationDto.getZeroBiasedAdjSquares(o2.adjSquares)) {
            return CandidateLocationDto.getZeroBiasedAdjSquares(o1.adjSquares) - CandidateLocationDto.getZeroBiasedAdjSquares(o2.adjSquares);
        }

        // highest number of flags
        if (0 !== o1.adjFlags - o2.adjFlags) {
            return -(o1.adjFlags - o2.adjFlags);
        }

        // location order
        return o1.sortOrder - o2.sortOrder;
    }

    private static getZeroBiasedAdjSquares(adjSquares: number): number
    {
        return 0 === adjSquares ? 9 : adjSquares;
    }
}
