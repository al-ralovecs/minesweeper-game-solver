import LocationDto from './location.dto';
import { StrategyType } from '../strategy/abstract-strategy';

export enum ActionType {
    Clear,
    Flag
}

export default class ActionDto extends LocationDto
{
    public type: ActionType;
    public moveMethod: StrategyType;
    public bigProbability: number;

    private readonly certainty: boolean;

    public constructor(location: LocationDto, type: ActionType, moveMethod: StrategyType, bigProbability: number) {
        super(location.y, location.x);

        this.type = type;
        this.moveMethod = moveMethod;
        this.bigProbability = bigProbability;

        this.certainty = 0.01 >= Math.abs(this.bigProbability - 1);
    }

    public get isCertainty(): boolean
    {
        return this.certainty;
    }

    public get getAction(): ActionType
    {
        return this.type;
    }
}
