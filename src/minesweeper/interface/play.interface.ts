import ActionDto from '../dto/action.dto';

export default interface PlayInterface {
    readonly getNextMove: ActionDto;
}
