import LocationSetDto from './location-set.dto';
import LocationDto from './location.dto';

export default class AreaDto {
    public area: LocationSetDto;
    private readonly readOnlyArea: LocationSetDto;

    public constructor(area: LocationSetDto) {
        this.area = area;
        this.readOnlyArea = this.area;
    }

    public contains(location: LocationDto): boolean {
        return this.area.contains(location);
    }

    public supersetOf(subset: AreaDto): boolean {
        return this.area.containsAll(subset.area);
    }

    public get getLocations(): LocationSetDto {
        return this.readOnlyArea;
    }

    public get size(): number {
        return this.area.data.length;
    }

    public remove(remove: LocationDto): AreaDto {
        if (! this.area.contains(remove)) {
            return this;
        }

        const result: LocationSetDto = new LocationSetDto(this.area.data);
        result.remove(remove);

        return new AreaDto(result);
    }

    public merge(mergeWith: AreaDto): AreaDto {
        const result: LocationSetDto = new LocationSetDto(this.area.data);
        result.addAll(mergeWith.area.data);

        return new AreaDto(result);
    }
}
