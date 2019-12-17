import LocationDto from "./location.dto";
import WitnessDto from "./witness.dto";

export default  class SquareDto extends LocationDto{
    private witnesses: WitnessDto[] = [];
    private webNum: number = 0;

    public constructor(location: LocationDto)
    {
        super(location.y, location.x);
    }
}

/*
public class Square extends Location {

    private final List<Witness> witnesses = new ArrayList<>();

    private int webNum = 0;


    public Square(Location loc) {
    	super(loc.x, loc.y);

    }

    public void addWitness(Witness wit) {
        witnesses.add(wit);
    }

    public List<Witness> getWitnesses() {
        return witnesses;
    }


    public int getWebNum() {
        return webNum;
    }

    public void setWebNum(int webNum) {
        this.webNum = webNum;
    }

}

 */