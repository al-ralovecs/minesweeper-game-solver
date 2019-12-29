import { StrategyType } from '../abstract-strategy';

import BoardStateDto from '../../dto/board-state.dto';
import WitnessWebDto from '../../dto/witness-web.dto';
import ProbabilityDistributionDto from '../../dto/probability-distribution.dto';

import ActionDto from '../../dto/action.dto';
import LocationDto from '../../dto/location.dto';
import AreaDto from '../../dto/area.dto';

import guessOffEdgeMethod from './guess-off-edge.method';
import pickOnEdgeMethod from './pick-on-edge.method';

export default function guess(
    boardState: BoardStateDto,
    wholeEdge: WitnessWebDto,
    probabilityDistribution: ProbabilityDistributionDto,
    moveMethod: StrategyType,
): ActionDto {
    const allWitnesses: LocationDto[] = boardState.getAllLivingWitnesses;
    const allWitnessedSquares: AreaDto = boardState.getUnrevealedArea(allWitnesses);

    if (0 === allWitnessedSquares.getLocations.data.length) {
        return guessOffEdgeMethod(boardState, wholeEdge, probabilityDistribution, moveMethod);
    }

    return pickOnEdgeMethod(boardState, probabilityDistribution, moveMethod);
}
