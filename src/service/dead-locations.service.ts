import BoardStateDto from '../dto/board-state.dto';
import LocationDto from '../dto/location.dto';
import LocationSetDto from '../dto/location-set.dto';
import AreaDto from '../dto/area.dto';

export default class DeadLocationsService
{
    private readonly boardState: BoardStateDto;
    private readonly witnesses: LocationDto[];
    private dead: AreaDto;

    public constructor(boardState: BoardStateDto, witnesses: LocationDto[])
    {
        this.boardState = boardState;
        this.witnesses = witnesses;
    }

    public process(): void
    {
        let dead: LocationSetDto = new LocationSetDto();

        for (const loc of this.witnesses) {
            if (this.boardState.countAdjacentUnrevealed(loc) === this.boardState.getWitnessValue(loc) - this.boardState.countAdjacentConfirmedFlags(loc) + 1) {
                const area: AreaDto = this.boardState.getAdjacentUnrevealedArea(loc);

                for (let i: number = 0; i < area.size; i++) {
                    const l: LocationDto = area.getLocations[i];

                    if (typeof l === 'undefined') {
                        continue;
                    }

                    const testArea: AreaDto = this.boardState.getAdjacentUnrevealedArea(l);
                    
                    if (area.supersetOf(testArea)) {
                        dead.add(l);
                    }
                }
            }
            
            const area: AreaDto = this.boardState.getAdjacentUnrevealedArea(loc);
            
            for (let i: number = 0; i < area.size; i++) {
                const l: LocationDto = area.getLocations[i];

                if (typeof l === 'undefined') {
                    continue;
                }

                const testArea = this.boardState.getAdjacentUnrevealedArea(l);
                
                if (0 === testArea.size) {
                    dead.add(l);
                } else if (testArea.size === area.size - 1 && area.supersetOf(testArea)) {
                    dead.add(l);
                }
            }
        }
        
        this.dead = new AreaDto(dead);
    }
    
    public get getDead(): AreaDto
    {
        return this.dead;
    }
}
