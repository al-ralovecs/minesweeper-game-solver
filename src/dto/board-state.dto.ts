import ActionDto, {ActionType} from "./action.dto";
import LocationDto from './location.dto';
import LocationSetDto from "./location-set.dto";
import AreaDto from "./area.dto";
import {AdjacentSquaresDto} from "./adjacent-squares.dto";
import ChordLocationDto from "./chord-location.dto";
import PlayInterface from "../interface/play.interface";

export default class BoardStateDto implements PlayInterface
{
    public readonly height: number;
    public readonly width: number;
    public readonly expectedTotalMines: number;

    public totalFlags: number = 0;
    public totalFlagsConfirmed: number = 0;
    public numOfHidden: number = 0;

    public flagConfirmed: boolean[][];
    public adjFlagsConfirmed: number[][];
    public adjUnrevealed: number[][];
    public revealed: boolean[][];
    public board: number[][];

    public flagOnBoard: boolean[][];
    public adjFlagsOnBoard: number[][];

    public action: ActionDto[][];
    public actionList: ActionDto[];

    public chordLocations: ChordLocationDto[] = [];

    public livingWitnesses: LocationSetDto = new LocationSetDto();

    public adjacentLocations1: AdjacentSquaresDto[][];
    public adjacentLocations2: AdjacentSquaresDto[][];

    public unPlayedMoves: number[];

    private testMoveBalance: number = 0;

    public constructor(height: number, width: number, expectedTotalMines: number)
    {
        this.height = height;
        this.width = width;
        this.expectedTotalMines = expectedTotalMines;

    }

    public get hasNextMove(): boolean
    {
        return 0 < this.actionList
            .filter(a => ActionType.Clear === a.type && a.isCertainty)
            .length;
    }

    public get getNextMove(): ActionDto
    {
        return this.getActions
            .filter(a => ActionType.Clear === a.type && a.isCertainty)
            .shift();
    }

    public get hasNewFlagFound(): boolean
    {
        return 0 < this.actionList
            .filter(a => ActionType.Flag === a.type)
            .length;
    }

    public get getTotalUnrevealedCount(): number
    {
        return this.numOfHidden;
    }

    public get getAllLivingWitnesses(): LocationDto[]
    {
        return this.livingWitnesses.data;
    }

    public countAdjacentUnrevealed(location: LocationDto): number
    {
        return this.adjUnrevealed[location.y][location.x];
    }

    public getUnrevealedArea(witnesses: LocationDto[]): AreaDto
    {
        return new AreaDto(this.getUnrevealedSquaresDo(witnesses));
    }

    private getUnrevealedSquaresDo(witnesses: LocationDto[]): LocationSetDto
    {
        let work: LocationSetDto = new LocationSetDto();

        for (const l of witnesses) {
            // this turned out necessary
            // for generically constructed arrays with empty items
            if (typeof l === 'undefined') {
                continue;
            }

            for (const adj of this.getAdjacentSquaresIterable(l)) {
                if (this.isUnrevealed(adj)) {
                    work.add(adj);
                }
            }
        }

        return work;
    }

    public isRevealed(location: LocationDto): boolean
    {
        return this.revealed[location.y][location.x];
    }

    public isUnrevealed(location: LocationDto): boolean
    {
        return ! this.flagConfirmed[location.y][location.x] && ! this.revealed[location.y][location.x];
    }

    public alreadyActioned(location: LocationDto): boolean
    {
        return typeof this.action[location.y][location.x] !== 'undefined';
    }

    public getAdjacentSquaresIterable(location: LocationDto, size: number = 1): Iterable<LocationDto>
    {
        if (1 !== size && 2 !== size) {
            throw Error(`[BoardState::getAdjacentSquaresIterable()] Invalid size [${size}] specified.`);
        }

        if (1 === size && undefined === this.adjacentLocations1[location.y][location.x]) {
            this.adjacentLocations1[location.y][location.x] = new AdjacentSquaresDto(
                location,
                this.height,
                this.width,
                size
            );
        }

        if (2 === size && undefined === this.adjacentLocations2[location.y][location.x]) {
            this.adjacentLocations2[location.y][location.x] = new AdjacentSquaresDto(
                location,
                this.height,
                this.width,
                size
            );
        }

        return 1 === size
            ? this.adjacentLocations1[location.y][location.x].locations
            : this.adjacentLocations2[location.y][location.x].locations;
    }

    public getWitnessValue(location: LocationDto): number
    {
        if (this.isUnrevealed(location)) {
            throw Error(`[BoardState] Failed when trying to get a witness (${location.x}, ${location.y}) valuu for an unrevealed square`);
        }

        return this.board[location.y][location.x];
    }

    public countAdjacentConfirmedFlags(location: LocationDto): number
    {
        return this.adjFlagsConfirmed[location.y][location.x];
    }

    public get getMines(): number
    {
        return this.expectedTotalMines;
    }

    public get getConfirmedFlagCount(): number
    {
        return this.totalFlagsConfirmed;
    }

    public countAdjacentFlagsOnBoard(location: LocationDto): number
    {
        return this.adjFlagsOnBoard[location.y][location.x];
    }

    public setChordLocation(location: LocationDto): boolean
    {
        let accepted: boolean = false;
        const benefit: number = this.countAdjacentUnrevealed(location);
        const cost: number = this.getWitnessValue(location) - this.countAdjacentFlagsOnBoard(location);

        if (1 < benefit - cost) {
            accepted = true;
            this.chordLocations.push(new ChordLocationDto(location.y, location.x, benefit - cost));
        }

        return accepted;
    }

    public set setAction(action: ActionDto)
    {
        if (typeof this.action[action.y][action.x] !== 'undefined') {
            return;
        }

        this.action[action.y][action.x] = action;

        if (ActionType.Flag === action.getAction) {
            this.setFlagConfirmed = action;
        }

        this.actionList.push(action);
    }

    public get getActions(): ActionDto[]
    {
        return this.actionList;
    }

    public isConfirmedFlag(l: LocationDto): boolean
    {
        return this.flagConfirmed[l.y][l.x];
    }

    private set setFlagConfirmed(loc: LocationDto)
    {
        if (this.isConfirmedFlag(loc)) {
            return;
        }

        this.totalFlagsConfirmed++;
        this.flagConfirmed[loc.y][loc.x] = true;

        if (! this.flagOnBoard[loc.y][loc.x]) {
            this.totalFlags++;
        }

        for (const a of this.getAdjacentSquaresIterable(loc)) {
            this.adjFlagsConfirmed[a.y][a.x]++;
            this.adjUnrevealed[a.y][a.x]--;
        }
    }

    public getAdjacentUnrevealedSquares(location: LocationDto): LocationDto[]
    {
        let work: LocationDto[] = [];

        for (const a of this.getAdjacentSquaresIterable(location)) {
            if (this.isUnrevealed(a)) {
                work.push(a);
            }
        }

        return work;
    }

    public getWitnesses(square: LocationDto[]): LocationDto[]
    {
        let work: LocationSetDto = new LocationSetDto();

        for (const loc of square) {
            for (const adj of this.getAdjacentSquaresIterable(loc)) {
                if (this.isRevealed(adj)) {
                    work.add(adj);
                }
            }
        }

        return work.data;
    }

    public getAdjacentUnrevealedArea(location: LocationDto): AreaDto
    {
        let locationSet: LocationSetDto = new LocationSetDto();

        for (const l of this.getAdjacentUnrevealedSquares(location)) {
            locationSet.add(l);
        }

        return new AreaDto(locationSet);
    }

    public get getAllUnrevealedSquares(): LocationDto[]
    {
        let result: LocationDto[] = [];

        for (let i: number = 0; i < this.height; i++) {
            for (let j: number = 0; j < this.width; j++) {
                const location: LocationDto = new LocationDto(i, j);

                if (! this.isUnrevealed(location)) {
                    continue;
                }

                result.push(location);
            }
        }

        return result;
    }

    public setWitnessValue(l: LocationDto, value: number): void
    {
        this.board[l.y][l.x] = value;
        this.revealed[l.y][l.x] = true;

        this.testMoveBalance++;
    }

    public clearWitness(l: LocationDto): void
    {
        this.board[l.y][l.x] = -1;
        this.revealed[l.y][l.x] = false;

        this.testMoveBalance--;
    }

    public isCorner(y: number, x: number): boolean
    {
        return (y === 0 || y === this.height - 1)
            && (x === 0 || x === this.width - 1);
    }
}
