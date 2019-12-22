import SolutionCounterService from '../service/solution-counter.service';
import WitnessWebService from '../service/witness-web.service';

import AreaDto from '../dto/area.dto';
import LocationDto from '../dto/location.dto';
import LocationSetDto from "../dto/location-set.dto";
import ProbabilityDistributionDto from '../dto/probability-distribution.dto';

/**
 * Checks
 * whether this location can have the value
 * using a probability engine check
 */
export default function solutionCounterValidateLocation(
    superLocation: LocationDto, 
    value: number
): ProbabilityDistributionDto {
    this.boardState.setWitnessValue(superLocation, value);

    let witnesses: LocationDto[] = new Array<LocationDto>(this.boardState.getAllLivingWitnesses.length + 1);
    witnesses.push(...this.wholeEdge.getPrunedWitnesses);
    witnesses.push(superLocation);

    let witnessed: AreaDto = this.boardState.getUnrevealedArea(witnesses);

    const edgeService: WitnessWebService = new WitnessWebService(this.boardState, this.binomial);
    edgeService.setAllWitnesses = witnesses;
    edgeService.setAllSquares = witnessed.getLocations.data;

    edgeService.process();

    const unrevealed: number = this.boardState.getTotalUnrevealedCount - 1;         // this is one less,
                                                                                    // because we have added a witness

    const minesLeft: number = this.boardState.expectedTotalMines - this.boardState.getConfirmedFlagCount;

    const counter: SolutionCounterService = new SolutionCounterService(
        this.boardState, 
        edgeService.getWitnessWeb,
        this.binomial,
        new AreaDto(new LocationSetDto())
    );
    counter.getProbabilityDistribution
        .minesLeft = minesLeft;
    counter.getProbabilityDistribution
        .squaresLeft = unrevealed - edgeService.getWitnessWeb.getSquares.length;

    counter.process();

    this.boardState.clearWitness(superLocation);

    return counter.getProbabilityDistribution;
}
