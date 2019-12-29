import { StrategyType } from '../abstract-strategy';

import BoardStateDto from '../../dto/board-state.dto';
import WitnessWebDto from '../../dto/witness-web.dto';
import ProbabilityDistributionDto from '../../dto/probability-distribution.dto';

import CandidateLocationDto from '../../dto/candidate-location.dto';
import LocationDto from '../../dto/location.dto';
import ActionDto from '../../dto/action.dto';

export default function guessOffEdgeMethod(
    boardState: BoardStateDto,
    wholeEdge: WitnessWebDto,
    probabilityDistribution: ProbabilityDistributionDto,
    moveMethod: StrategyType,
): ActionDto {
    const candidateList: CandidateLocationDto[] = [];

    for (let i: number = 0; i < boardState.height; i++) {
        for (let j: number = 0; j < boardState.width; j++) {
            const location: LocationDto = new LocationDto(i, j);

            if (! boardState.isUnrevealed(location)) {
                continue;
            }

            if (wholeEdge.isOnWeb(location)) {
                continue;
            }

            candidateList.push(
                new CandidateLocationDto(
                    location.y,
                    location.x,
                    probabilityDistribution.offEdgeProbability,
                    boardState.countAdjacentUnrevealed(location),
                    boardState.countAdjacentConfirmedFlags(location),
                ),
            );
        }
    }

    if (0 === candidateList.length) {
        throw Error('[GuessOffEdge] Something went wrong, none tiles guessed');
    }

    return candidateList
        .sort(CandidateLocationDto.sortByProbabilityFreeFlag)
        .shift()
        .buildAction(moveMethod);
}
