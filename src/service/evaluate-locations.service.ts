import BoardStateDto from "../dto/board-state.dto";
import WitnessWebDto from "../dto/witness-web.dto";
import Binomial from "../utility/binomial";
import ProbabilityDistributionDto from "../dto/probability-distribution.dto";
import EvaluatedLocationDto from "../dto/evaluated-location.dto";
import ActionDto, {ActionType} from "../dto/action.dto";
import {StrategyType} from "../strategy/abstract-strategy";
import LocationDto from "../dto/location.dto";
import LocationSetDto from "../dto/location-set.dto";
import isCoordinatesValid from '../routine/coordinate.is-valid';
import bigintDivide from '../routine/bigint.divide';
import LinkedLocationDto from "../dto/linked-location.dto";
import AreaDto from "../dto/area.dto";
import WitnessWebService from "./witness-web.service";
import SolutionCounterService from "./solution-counter.service";

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
    private readonly binomialEngine: Binomial;
    private readonly probabilityDistribution: ProbabilityDistributionDto;

    private moveMethod: StrategyType;

    public evaluated: EvaluatedLocationDto[] = [];

    public constructor(
        boardState: BoardStateDto,
        wholeEdge: WitnessWebDto,
        binomialEngine: Binomial,
        probabilityDistribution: ProbabilityDistributionDto
    ) {
        this.boardState = boardState;
        this.wholeEdge  = wholeEdge;
        this.binomialEngine = binomialEngine;
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

        this.evaluateLocations(tileOfInterest.data);

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

            const counter: ProbabilityDistributionDto = this.validateLocation(tile, adjMines);

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
                0,
                this.boardState.isCorner(tile.y, tile.x)
            );

            this.evaluated.push(evalTile);
        }
    }

    /**
     * Evaluate a set of tiles
     * to see the expected number of clears
     * it will provide
     *
     * @param tiles LocationDto[]
     */
    public evaluateLocations(tiles: LocationDto[]): void
    {
        for (const tile of tiles) {
            this.evaluateLocation(tile);
        }
    }

    /**
     * Evaluate a tile
     * to see the expected number of clears
     * it will provide
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
        let result: EvaluatedLocationDto;

        const superset: LocationDto[] = this.boardState.getAdjacentUnrevealedSquares(tile);
        const minesGot: number = this.boardState.countAdjacentConfirmedFlags(tile);

        let minMines: number = minesGot;
        let hits: number = 0;

        for (const loc of this.boardState.getAdjacentSquaresIterable(tile, 2)) {
            if (! (this.boardState.isRevealed(loc) && 0 !== this.boardState.countAdjacentUnrevealed(loc))) {
                continue;
            }

            let supersetOkay: boolean = true;

            for (const adj of this.boardState.getAdjacentSquaresIterable(loc)) {
                if (! this.boardState.isUnrevealed(adj)) {
                    continue;
                }

                let found: boolean = false;

                if (adj.equals(tile)) {
                    found = true;
                } else {
                    for (const test of superset) {
                        if (adj.equals(test)) {
                            found = true;

                            break;
                        }
                    }
                }

                if (! found) {
                    supersetOkay = false;

                    break;
                }
            }

            if (supersetOkay) {
                hits++;

                let minesNeeded: number = this.boardState.getWitnessValue(loc) - this.boardState.countAdjacentConfirmedFlags(loc);
                let value: number = minesNeeded - minesGot;

                if (minMines < value) {
                    minMines = value;
                }
            }
        }

        if (0 === hits) {
            hits = 1;
        }

        let maxMines: number = Math.min(minMines + hits - 1, minesGot + superset.length);

        const probThisTile: number = this.probabilityDistribution.getProbability(tile);
        const linkedLocation: LinkedLocationDto = this.probabilityDistribution.getLinkedLocation(tile);

        let linkedTiles: number = 0;
        if (null !== linkedLocation) {
            linkedTiles = linkedLocation.getLinksCount;
        }

        let expectedClears: number = probThisTile;
        let progressProb: number = 0;

        for (let i: number = minMines; i < maxMines + 1; i++) {
            let clears: number = 1;

            const counter: ProbabilityDistributionDto = this.validateLocation(tile, i);
            const sol: bigint = counter.finalSolutionsCount;
            clears = counter.clearCount;

            if (0n < sol && clears > linkedTiles) {
                const prob: number = bigintDivide(sol, this.probabilityDistribution.finalSolutionsCount, 6);
                expectedClears += (clears - linkedTiles) * prob;
                progressProb += prob;
            } else if (0n === sol) {
                // if we are only checking one value
                // and it has no chance
                // then try one more
                if (i === minMines && i === maxMines) {
                    maxMines++;
                }
            }
        }

        if (0 < linkedTiles) {
            progressProb = probThisTile;
        }

        result = new EvaluatedLocationDto(
            tile.y,
            tile.x,
            probThisTile,
            progressProb,
            expectedClears,
            linkedTiles,
            this.boardState.isCorner(tile.y, tile.x)
        );

        if (null !== linkedLocation) {
            top:
            for (const link of linkedLocation.getLinkedLocations.data) {
                for (const e of this.evaluated) {
                    if (e.equals(link)) {
                        e.merge(result);
                        result = null;
                        break top;
                    }
                }
            }
        }

        return result;
    }

    private validateLocation(superLocation: LocationDto, value: number): ProbabilityDistributionDto
    {
        this.boardState.setWitnessValue(superLocation, value);

        let witnesses: LocationDto[] = new Array<LocationDto>(this.boardState.getAllLivingWitnesses.length + 1);
        witnesses.push(...this.wholeEdge.getPrunedWitnesses);
        witnesses.push(superLocation);

        let witnessed: AreaDto = this.boardState.getUnrevealedArea(witnesses);

        const edgeService: WitnessWebService = new WitnessWebService(this.boardState, this.binomialEngine);
        edgeService.setAllWitnesses = witnesses;
        edgeService.setAllSquares = witnessed.getLocations.data;

        edgeService.process();

        const unrevealed: number = this.boardState.getTotalUnrevealedCount - 1;         // this is one less,
                                                                                        // because we have added a witness

        const minesLeft: number = this.boardState.expectedTotalMines - this.boardState.getConfirmedFlagCount;

        const counter: SolutionCounterService = new SolutionCounterService(
            this.boardState,
            edgeService.getWitnessWeb,
            this.binomialEngine,
            new AreaDto(new LocationSetDto())
        );
        counter.getProbabilityDistribution
            .minesLeft = minesLeft;
        counter.getProbabilityDistribution
            .squaresLeft = unrevealed - edgeService.getWitnessWeb.getSquares.length;

        counter.process();

        this.boardState.clearWitness(superLocation);

        return counter.getProbabilityDistribution;
    }
}
