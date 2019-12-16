import LocationDto from "./location.dto";

export default class LocationSetDto {
    public data: LocationDto[] = [];

    public add(location: LocationDto): void
    {
        if (0 === this.data.filter(l => l.value === location.value).length) {
            this.data.push(location);
        }
    }

    public removeAll(toRemove: LocationDto[]): void
    {
        if (0 === toRemove.length) {
            return;
        }

        let toRemoveValues: string[] = toRemove.map(l => l.value);

        this.data = this.data.filter(l => -1 === toRemoveValues.indexOf(l.value));
    }
}
