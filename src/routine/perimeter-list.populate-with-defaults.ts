import PerimeterListItemDto from '../dto/perimeter-list-item.dto';

export function createPerimeterListAndPopulateWithDefaults (
    y: number,
    x: number,
    listsCount: number,
    startingIndex: number
): PerimeterListItemDto {
    const perimeterList: PerimeterListItemDto = new PerimeterListItemDto();

    perimeterList.y = y;
    perimeterList.x = x;
    perimeterList.neighborCount = 0;
    perimeterList.adjacentListCount = 0;
    perimeterList.isDead = false;
    perimeterList.similarListsIndex = undefined;
    perimeterList.nextListIndex = startingIndex;
    perimeterList.index = listsCount;
    perimeterList.tried = -1;
    perimeterList.merged = -1;

    return perimeterList;
}
