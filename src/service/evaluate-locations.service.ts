import BoardStateDto from "../dto/board-state.dto";
import WitnessWebDto from "../dto/witness-web.dto";
import ProbabilityDistributionDto from "../dto/probability-distribution.dto";
import EvaluatedLocationDto from "../dto/evaluated-location.dto";
import ActionDto, {ActionType} from "../dto/action.dto";
import {StrategyType} from "../strategy/abstract-strategy";
import LocationDto from "../dto/location.dto";
import LocationSetDto from "../dto/location-set.dto";
import isCoordinatesValid from '../routine/coordinate.is-valid';
import solutionCounterValidateLocation from "../routine/solution-counter.validate-location";
import bigintDivide from '../routine/bigint.divide';

const OFFSETS = [
    [  2,  0 ],
    [ -2,  0 ],
    [  0,  2 ],
    [  0, -2 ]
];

const SORT_ORDER = EvaluatedLocationDto.sortByProgressProbability;

export default class EvaluateLocationsService
{
    private readonly boardState: BoardStateDto;
    private readonly wholeEdge: WitnessWebDto;
    private readonly probabilityDistribution: ProbabilityDistributionDto;

    private moveMethod: StrategyType;

    public evaluated: EvaluatedLocationDto[] = [];

    public constructor(
        boardState: BoardStateDto,
        wholeEdge: WitnessWebDto,
        probabilityDistribution: ProbabilityDistributionDto
    ) {
        this.boardState = boardState;
        this.wholeEdge  = wholeEdge;
        this.probabilityDistribution = probabilityDistribution;
    }

    public get hasBestMove(): boolean
    {
        return 0 < this.evaluated.length;
    }

    public set setMoveMethod(moveMethod: StrategyType)
    {
        this.moveMethod = moveMethod;
    }

    public get getMoveMethod(): StrategyType
    {
        if (typeof this.moveMethod === 'undefined') {
            throw Error('[EvaluateLocationsService::getMoveMethod] Calling get method before set method was called');
        }

        return this.moveMethod;
    }

    public get getBestMove(): ActionDto
    {
        if (! this.hasBestMove) {
            throw Error('[EvaluateLocationsService::getBestMove] Calling method when none best move exists');
        }

        const evaluatedLocation: EvaluatedLocationDto = this.evaluated
            .sort(SORT_ORDER)
            .shift();

        return new ActionDto(
            evaluatedLocation,
            ActionType.Clear,
            this.getMoveMethod,
            evaluatedLocation.clearProbability
        )
    }

    public addOffEdgeCandidates(allUnrevealedSquares: LocationDto[]): void
    {
        let tileOfInterest: LocationSetDto = new LocationSetDto();

        for (const tile of this.wholeEdge.originalWitnesses) {
            for (const offset of OFFSETS) {
                const y1 = tile.y + offset[1];
                const x1 = tile.x + offset[0];

                if (! isCoordinatesValid(y1, x1, this.boardState.height, this.boardState.width)) {
                    continue;
                }

                const loc: LocationDto = new LocationDto(y1, x1);

                if (this.boardState.isUnrevealed(loc) && ! this.wholeEdge.isOnWeb(loc)) {
                    tileOfInterest.add(loc);
                }
            }
        }

        this.evaluateLocations(tileOfInterest);

        for (const tile of allUnrevealedSquares) {
            const adjMines: number = this.boardState.countAdjacentConfirmedFlags(tile);
            const adjUnrevealed: number = this.boardState.countAdjacentUnrevealed(tile);

            if (! (
                1 < adjUnrevealed
                && 4 > adjUnrevealed
                && ! this.wholeEdge.isOnWeb(tile)
                && ! tileOfInterest.contains(tile)
            )) {
                continue;
            }

            const counter: ProbabilityDistributionDto = solutionCounterValidateLocation(tile, adjMines);

            const solutions: bigint = counter.finalSolutionsCount;

            if (0n === solutions) {
                continue;
            }

            const probThisTile: number = this.probabilityDistribution.getProbability(tile);

            // calculate probability of this tile's value being 'adjMines'
            const prob: number = bigintDivide(solutions, this.probabilityDistribution.finalSolutionsCount, 6);

            // expect tiles cleared if we play here
            const expectedClears: number = counter.clearCount * prob;

            const evalTile: EvaluatedLocationDto = new EvaluatedLocationDto(
                tile.y,
                tile.x,
                probThisTile,
                prob,
                expectedClears,
                this.isCorner(tile.y, tile.x)
            );

            this.evaluated.push(evalTile);
        }
    }

    private isCorner(y: number, x: number): boolean
    {
        return (y === 0 || y === this.boardState.height - 1)
            && (x === 0 || x === this.boardState.width - 1);
    }

    /**
     * Evaluate a set of tiles
     * to see the expected number of clears it will provide
     *
     * @param LocationDto[] tiles
     */
    private evaluateLocations(tiles: LocationDto[]): void
    {
        for (const tile of tiles) {
            this.evaluateLocation(tile);
        }
    }

    /**
     * Evaluate a tile
     * to see the expected number of clears it will provide
     *
     * @param tile
     */
    private evaluateLocation(tile: LocationDto): void
    {
        const evalTile: EvaluatedLocationDto = this.doEvaluateTile(tile);

        if (null !== evalTile) {
            this.evaluated.push(evalTile);
        }
    }

    private doEvaluateTile(tile: LocationDto): EvaluatedLocationDto
    {

    }
}

/**
 /**
 * Evaluate this tile and return its EvaluatedLocation
 *
private EvaluatedLocation doEvaluateTile(Location tile) {

    //long nanoStart = System.nanoTime();
    //boardState.display(tile.display() + " is of interest as a superset");

    EvaluatedLocation result = null;

    List<Location> superset = boardState.getAdjacentUnrevealedSquares(tile);
    int minesGot = boardState.countAdjacentConfirmedFlags(tile);

    //boardState.display("----");

    int minMines = minesGot;
    int hits = 0;

    for (Location loc: boardState.getAdjacentSquaresIterable(tile, 2)) {

        if (boardState.isRevealed(loc) && boardState.countAdjacentUnrevealed(loc) != 0) {   // if the location is revealed then see if we are a super set of it

            boolean supersetOkay = true;
            //boolean subSetIncludesMe = false; // does the subset contain the Tile we are considering
            for (Location adj: boardState.getAdjacentSquaresIterable(loc)) {
                if (boardState.isUnrevealed(adj)) {
                    boolean found = false;

                    if (adj.equals(tile)) {  // if the subset contains me that's okay
                        found = true;
                        //subSetIncludesMe = true;

                    } else {   // otherwise check the superset
                        for (Location test: superset) {
                            if (adj.equals(test)) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        supersetOkay = false;
                        break;
                    }
                }
            }
            if (supersetOkay) {
                int minesNeeded = boardState.getWitnessValue(loc) - boardState.countAdjacentConfirmedFlags(loc);
                int value = minesNeeded + minesGot;
                //boardState.display(tile.display() + " is a superset of " + loc.display() + " value " + value);
                hits++;
                if (minMines < value) {
                    minMines = value;
                }
            }

        }
    }

    // if we aren't a superset square then just see what the chances that this square is already fully satisfied.
    if (hits == 0) {
        boardState.display(tile.display() + " is not a superset");
        hits = 1;
    } else {
        boardState.display(tile.display() + " is a superset " + hits + " times");
    }

    int maxMines = Math.min(minMines + hits - 1, minesGot + superset.size());

    BigDecimal probThisTile = pe.getProbability(tile);
    LinkedLocation linkedLocation = pe.getLinkedLocation(tile);
    int linkedTiles;
    if (linkedLocation != null) {
        linkedTiles = linkedLocation.getLinksCount();
    } else {
        linkedTiles = 0;
    }


    // work out the expected number of clears if we clear here to start with (i.e. ourself + any linked clears)
    //BigDecimal expectedClears = BigDecimal.valueOf(1 + linkedTiles).multiply(probThisTile);
    //BigDecimal expectedClears = BigDecimal.ZERO;
    BigDecimal expectedClears = probThisTile;

    //boardState.display(tile.display() + " has " + linkedTiles + " linked tiles");

    BigDecimal progressProb = BigDecimal.ZERO;

    for (int i = minMines; i < maxMines + 1; i++) {
        //int clears = solver.validateLocationUsingLocalCheck(tile, i);
        int clears = 1;
        if (clears > 0) {

            SolutionCounter counter = solver.validateLocationUsingSolutionCounter(tile, i);
            BigInteger sol = counter.getSolutionCount();
            clears = counter.getClearCount();

            if (sol.signum() != 0 && clears > linkedTiles) {
                //if (sol.signum() != 0) {

                BigDecimal prob = new BigDecimal(sol).divide(new BigDecimal(pe.getSolutionCount()), Solver.DP, RoundingMode.HALF_UP);
                boardState.display(tile.display() + " with value " + i + " has " + clears + " clears with probability " + prob.toPlainString());

                // expected clears is the sum of the number of mines cleared * the probability of clearing them
                expectedClears = expectedClears.add(BigDecimal.valueOf(clears - linkedTiles).multiply(prob));

                progressProb = progressProb.add(prob);
            } else {
                if (sol.signum() == 0) {
                    boardState.display(tile.display() + " with value " + i + " with probability zero");
                    if (i == minMines && i == maxMines) {  // if we are only checking one value and it has no chance then try one more
                        maxMines++;
                    }
                } else {
                    boardState.display(tile.display() + " with value " + i + " only has linked clears");
                }

            }

        } else {
            boardState.display(tile.display() + " with value " + i + " fails local check");
        }
    }

    if (linkedTiles > 0) {
        progressProb = probThisTile;
    }



    //if (expectedClears.compareTo(BigDecimal.ZERO) > 0) {
    result = new EvaluatedLocation(tile.x, tile.y, probThisTile, progressProb, expectedClears, linkedTiles, isCorner(tile));

    if (linkedLocation != null) {
        boardState.display("Considering with " + linkedLocation.getLinkedLocations().size() + " linked locations");
        top: for (Location link: linkedLocation.getLinkedLocations()) {
            boardState.display("Linked with " + link.display());
            for (EvaluatedLocation e: evaluated) {
                if (e.equals(link)) {
                    boardState.display("Found link in evaluated" + link.display());
                    e.merge(result);
                    result = null;
                    break top;
                }
            }
        }
    }
    //}

    //long nanoEnd = System.nanoTime();

    //boardState.display("Duration = " + (nanoEnd - nanoStart) + " nano-seconds");

    return result;

}
 */