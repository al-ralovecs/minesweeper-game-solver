import LocationDto from "./location.dto";
import BoxDto from "./box.dto";

export default class ProbabilityDistributionDto
{
    private readonly boxes: BoxDto[];
    public boxProb: number[];
    public offEdgeProbability: number;

    public getProbability(location: LocationDto): number
    {
        for (const b of this.boxes) {
            if (b.contains(location)) {
                return this.boxProb[b.getUID];
            }
        }

        return this.offEdgeProbability;
    }
}

/**

 */