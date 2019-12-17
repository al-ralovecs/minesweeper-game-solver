import LocationDto from "./location.dto";
import SquareDto from "./square.dto";

export default class WitnessDto extends LocationDto
{
    private readonly mines: number;
    private readonly iterations: number;
    private webNum: number = 0;

    private squares: SquareDto[];

    private processed: boolean = false;

    public constructor(location: LocationDto, mines: number, adjSku: SquareDto[])
    {
        super(location.y, location.x);

        this.mines = mines;
        this.squares = adjSku;
        this.iterations = computeCombination(this.mines, this.squares.length);
    }
}

/**
 private final int mines;   // the number of mines left to find

 private final int iterations;

 private int webNum = 0;

 private final List<Square> squares;

 private final List<Box> boxes = new ArrayList<>();

 private boolean processed = false;

 public Witness(Location loc, int mines, List<Square> adjSqu) {
    	super(loc.x, loc.y);

        this.mines = mines;
        squares = adjSqu;

        this.iterations = Solver.combination(mines, squares.size()).intValue();

    }
 */