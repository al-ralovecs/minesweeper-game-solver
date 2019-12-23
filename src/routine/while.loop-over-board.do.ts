import BoardStateDto from '../dto/board-state.dto';
import LocationDto from '../dto/location.dto';

export const whileLoopOverBoardDo = function (
    boardState: BoardStateDto,
    callable: (location: LocationDto, y: number, x: number) => void
) {
    for (let y: number = 0; y < boardState.height; y++) {
        for (let x: number = 0; x < boardState.width; x++) {
            const location: LocationDto = new LocationDto(y, x);

            callable(location, y, x);
        }
    }
};
