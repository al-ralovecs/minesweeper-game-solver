import {AbstractStrategy, StrategyType} from "./abstract-strategy";
import LocationDto from "../dto/location.dto";
import AreaDto from "../dto/area.dto";

export default class TrivialStrategy extends AbstractStrategy
{
    public readonly name: StrategyType = StrategyType.Trivial;

    apply()
    {
        let unrevealed: number = this.boardState.getTotalUnrevealedCount;
        let allWitnesses: LocationDto[] = this.boardState.getAllLivingWitnesses;
        let allWitnessedSquares: AreaDto = this.boardState.getUnrevealedArea(allWitnesses);



            /**
             // find all the zones on the board which don't touch
             //zones = determineZones();

             int unrevealed = boardState.getTotalUnrevealedCount();

             // get all the witnesses on the board and all the squares next to them
             //allWitnesses = getAllWitnesses(zones);
             //allWitnessedSquares = getAllWitnessedSquares(zones);

             allWitnesses = boardState.getAllLivingWitnesses();
             allWitnessedSquares = boardState.getUnrevealedArea(allWitnesses);
             */
            }
}
