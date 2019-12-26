import LocationDto from './location.dto';
import LocationSetDto from './location-set.dto';

export default class LinkedLocationDto extends LocationDto {
    private partners: LocationSetDto = new LocationSetDto();
    private links: number = 0;

    public constructor(y: number, x: number, partner: LocationDto[]) {
        super(y, x);

        this.incrementLinks(partner);
    }

    public static sortByLinksDesc(o1: LinkedLocationDto, o2: LinkedLocationDto): number {
        return o2.links - o1.links;
    }

    public incrementLinks(partner: LocationDto[]): void {
        for (const p of partner) {
            if (this.partners.add(p)) {
                this.links++;
            }
        }
    }

    public get getLinksCount(): number {
        return this.links;
    }

    public get getLinkedLocations(): LocationSetDto {
        return this.partners;
    }
}
