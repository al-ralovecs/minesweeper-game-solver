import PerimeterListDto from './perimeter-list-item.dto';

export class PerimeterListsListDto {
    public items: PerimeterListDto[];

    private currentItemIndex: number;

    public add(index: number, perimeterList: PerimeterListDto): void
    {
        if (typeof this.currentItemIndex[index] !== 'undefined') {
            throw Error(`[PerimeterListsList] Cannot add a list with index [${index}]; this index is already reserved`);
        }

        this.currentItemIndex = index;
        this.items[index] = perimeterList;
    }

    public get current(): PerimeterListDto
    {
        return this.items[this.currentItemIndex];
    }

    public get previous(): PerimeterListDto
    {
        if (0 === this.currentItemIndex && 1 !== this.items.length) {
            return this.items[this.items.length - 1];
        }

        if (0 < this.currentItemIndex) {
            return this.items[this.currentItemIndex - 1];
        }
    }

    public get next(): PerimeterListDto
    {
        const index: number = this.current.nextListIndex;

        if (typeof index === 'undefined') {
            throw Error('[PerimeterListsList] Fail on attempt to query next item which was not defined in advance');
        }

        if (0 <= index && this.items.length > index) {
            return this.items[index];
        }

        throw Error(`[PerimeterListsList] Invalid nextListIndex [${index}] specified in current list [${this.currentItemIndex}`);
    }
}
