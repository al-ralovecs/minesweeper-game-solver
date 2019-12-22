import BoardStateDto from '../../dto/board-state.dto';
import ProbabilityDistributionDto from '../../dto/probability-distribution.dto';

import { StrategyType } from '../abstract-strategy';
import ActionDto, { ActionType } from '../../dto/action.dto';

import LocationDto from '../../dto/location.dto';
import AreaDto from '../../dto/area.dto';

export default function pickOnEdgeMethod(
    boardState: BoardStateDto, 
    probabilityDistribution: ProbabilityDistributionDto,
    moveMethod: StrategyType
): void {
    const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
    const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);

    const picked: LocationDto = allWitnessedSquares
        .getLocations
        .data
        .shift();

    boardState.setAction = new ActionDto(
        picked,
        ActionType.Clear,
        moveMethod,
        probabilityDistribution.getProbability(picked)
    );
}
