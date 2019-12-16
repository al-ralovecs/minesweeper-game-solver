import LocationDto from '../dto/location.dto';

export default interface PlayInterface
{
    readonly getNextMove: LocationDto;
}
