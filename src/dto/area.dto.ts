import LocationSetDto from "./location-set.dto";

export default class AreaDto {
    private area: LocationSetDto;
    private readonly readOnlyAre: LocationSetDto;

    public constructor(area: LocationSetDto)
    {
        this.area = area;
    }
}
