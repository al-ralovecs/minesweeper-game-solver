import LocationDto from './location.dto';

export default class LocationSetDto {
    public data: LocationDto[] = [];

    public constructor(locations: LocationDto[] = []) {
        this.data = locations;
    }

    public contains(location: LocationDto): boolean {
        return  (0 !== this.data.filter(l => l.equals(location)).length);
    }

    public add(location: LocationDto): boolean {
        if (! this.contains(location)) {
            this.data.push(location);

            return true;
        }

        return false;
    }

    public addAll(locations: LocationDto[]): void {
        for (const location of locations) {
            if (this.contains(location)) {
                continue;
            }

            this.add(location);
        }
    }

    public containsAll(subset: LocationSetDto): boolean {
        let result: boolean = true;

        for (const l of subset.data) {
            if (! this.contains(l)) {
                result = false;
                break;
            }
        }

        return result;
    }

    public remove(remove: LocationDto): void {
        if (! this.contains(remove)) {
            return;
        }

        this.data = this.data.filter(l => ! l.equals(remove));
    }

    public removeAll(toRemove: LocationDto[]): void {
        if (0 === toRemove.length) {
            return;
        }

        const toRemoveValues: string[] = toRemove.map(l => l.value);

        this.data = this.data.filter(l => -1 === toRemoveValues.indexOf(l.value));
    }
}
