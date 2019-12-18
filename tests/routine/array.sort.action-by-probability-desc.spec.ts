import ActionDto, {ActionType} from "../../src/dto/action.dto";
import LocationDto from "../../src/dto/location.dto";
import {StrategyType} from "../../src/strategy/abstract-strategy";

describe('Array<ActionDto>()', () => {
    test('try to sort by probability desc', () => {
        let actionList: ActionDto[] = [];

        actionList.push(new ActionDto(new LocationDto(1, 1), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.4));
        actionList.push(new ActionDto(new LocationDto(2, 2), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.6));
        actionList.push(new ActionDto(new LocationDto(3, 3), ActionType.Clear, StrategyType.TrivialSearch, 0.73));
        actionList.push(new ActionDto(new LocationDto(4, 4), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.72));
        actionList.push(new ActionDto(new LocationDto(5, 5), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.3));
        actionList.push(new ActionDto(new LocationDto(6, 6), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.43));
        actionList.push(new ActionDto(new LocationDto(7, 7), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.5));
        actionList.push(new ActionDto(new LocationDto(8, 8), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.5));
        actionList.push(new ActionDto(new LocationDto(9, 9), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.21));
        actionList.push(new ActionDto(new LocationDto(0, 0), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.66));

        const action: ActionDto = actionList
            .filter(a => StrategyType.FiftyFiftyGuess === a.moveMethod && ActionType.Clear === a.type)
            .sort((o1: ActionDto, o2: ActionDto) => {
                return o2.bigProbability - o1.bigProbability
            })
            .shift();

        expect(action).toStrictEqual(
            new ActionDto(new LocationDto(4, 4), ActionType.Clear, StrategyType.FiftyFiftyGuess, 0.72)
        );
    });
});
