import LocationDto from './location.dto';

export default class WitnessDataDto {
    public location: LocationDto;
    public witnessRestFlag: boolean = true;
    public witnessRestClear: boolean = true;
    public witnessGood: number;
    public currentFlags: number;
    public alwaysSatisfied: boolean;
}
