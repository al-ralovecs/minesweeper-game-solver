import LocationDto from './location.dto';
import WitnessDto from './witness.dto';

export default  class SquareDto extends LocationDto {
    private witnesses: WitnessDto[] = [];
    private webNum: number = 0;

    public constructor(location: LocationDto) {
        super(location.y, location.x);
    }

    public set addWitness(witness: WitnessDto) {
        this.witnesses.push(witness);
    }

    public get getWitnesses(): WitnessDto[] {
        return this.witnesses;
    }

    public set setWebNum(webNum: number) {
        this.webNum = webNum;
    }

    public get getWebNum(): number {
        return this.webNum;
    }
}
