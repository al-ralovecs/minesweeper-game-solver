import ActionDto from '../dto/action.dto';

export default interface PlayInterface
{
    readonly hasNextMove: boolean;
    readonly getNextMove: ActionDto;
}
