import {AbstractStrategy, StrategyType} from "./abstract-strategy";

export default class TrivialStrategy extends AbstractStrategy
{
    public readonly name: StrategyType = StrategyType.Trivial;

    apply()
    {
    }
}
