import ServiceInterface from '../interface/service.interface';

import BoardStateDto from '../dto/board-state.dto';
import LocationDto from '../dto/location.dto';
import LocationSetDto from '../dto/location-set.dto';
import AreaDto from '../dto/area.dto';

export default class DeadLocationsService implements ServiceInterface {
    private readonly boardState: BoardStateDto;
    private readonly witnesses: LocationDto[];
    private data: AreaDto;

    public constructor(boardState: BoardStateDto, witnesses: LocationDto[]) {
        this.boardState = boardState;
        this.witnesses = witnesses;
    }

    /**
     * Look for "dead" locations.
     *
     * "dead" is a location, which:
     *  - is either a mine,
     *  - or have just one possible value.
     */
    public process(): void {
        const dead: LocationSetDto = new LocationSetDto();
        for (const loc of this.witnesses) {
            if (this.boardState.countAdjacentUnrevealed(loc) ===
                this.boardState.getWitnessValue(loc) - this.boardState.countAdjacentConfirmedFlags(loc) + 1
            ) {
                const area: AreaDto = this.boardState.getAdjacentUnrevealedArea(loc);
                for (let i: number = 0; i < area.size; i++) {
                    const l: LocationDto = area.getLocations.data[i];

                    const testArea: AreaDto = this.boardState.getAdjacentUnrevealedArea(l);
                    if (area.supersetOf(testArea)) {
                        dead.add(l);
                    }
                }
            }
            const area: AreaDto = this.boardState.getAdjacentUnrevealedArea(loc);
            for (let i: number = 0; i < area.size; i++) {
                const l: LocationDto = area.getLocations.data[i];

                const testArea = this.boardState.getAdjacentUnrevealedArea(l);
                if (0 === testArea.size) {
                    dead.add(l);
                } else if (testArea.size === area.size - 1 && area.supersetOf(testArea)) {
                    dead.add(l);
                }
            }
        }
        this.data = new AreaDto(dead);
    }
    
    public get getData(): AreaDto {
        return this.data;
    }
}
