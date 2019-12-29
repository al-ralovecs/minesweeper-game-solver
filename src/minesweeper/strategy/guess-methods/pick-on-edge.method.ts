import { StrategyType } from '../abstract-strategy';

import BoardStateDto from '../../dto/board-state.dto';
import ProbabilityDistributionDto from '../../dto/probability-distribution.dto';

import ActionDto, { ActionType } from '../../dto/action.dto';
import LocationDto from '../../dto/location.dto';
import AreaDto from '../../dto/area.dto';

export default function pickOnEdgeMethod(
    boardState: BoardStateDto,
    probabilityDistribution: ProbabilityDistributionDto,
    moveMethod: StrategyType,
): ActionDto {
    const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
    const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);

    const picked: LocationDto = allWitnessedSquares
        .getLocations
        .data
        .shift();

    if (typeof picked === 'undefined' || null === picked) {
        throw Error('[PickOnEdge] Something went wrong, none tiles picked');
    }

    return new ActionDto(
        picked,
        ActionType.Clear,
        moveMethod,
        probabilityDistribution.getProbability(picked),
    );
}
