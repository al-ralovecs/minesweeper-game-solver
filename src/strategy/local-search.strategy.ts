import { AbstractStrategy, StrategyType } from './abstract-strategy';
import BoardStateDto from '../dto/board-state.dto';
import WitnessWebDto from '../dto/witness-web.dto';
import LocationDto from '../dto/location.dto';
import SequentialIterator from '../iterator/sequential-iterator';
import CrunchResultDto from '../dto/crunch-result.dto';
import WitnessDataDto from '../dto/witness-data.dto';
import ActionDto, { ActionType } from '../dto/action.dto';

export default class LocalSearchStrategy extends AbstractStrategy
{
    private readonly wholeEdge: WitnessWebDto;

    private workRestNotFlags: boolean[];
    private workRestNotClear: boolean[];

    public constructor(boardState: BoardStateDto, wholeEdge: WitnessWebDto)
    {
        super(boardState);

        this.wholeEdge = wholeEdge;
    }

    protected applyStrategy()
    {
        let count: number = 0;

        let square: LocationDto[];
        let witness: LocationDto[];

        for (const location of this.wholeEdge.getPrunedWitnesses) {
            let flags: number = this.boardState.countAdjacentConfirmedFlags(location);
            let free: number = this.boardState.countAdjacentUnrevealed(location);

            if (0 < free
                && this.boardState.getWitnessValue(location) > flags
                && this.boardState.getWitnessValue(location) < flags + free
            ) {
                square = this.boardState.getAdjacentUnrevealedSquares(location);
                witness = this.boardState.getWitnesses(square);

                if (1 >= witness.length) {
                    continue;
                }

                let output: CrunchResultDto = this.crunch(
                    square,
                    witness,
                    new SequentialIterator(this.boardState.getWitnessValue(location) - flags, square.length)
                );

                count += this.checkBigTally(output, StrategyType.LocalSearch);
                count += this.checkWitnesses(output, StrategyType.LocalSearch);
            }
        }
    }

    protected get getMoveMethod(): StrategyType
    {
        return StrategyType.LocalSearch;
    }

    private crunch(square: LocationDto[], witness: LocationDto[], iterator: SequentialIterator): CrunchResultDto
    {
        let bigDistribution: bigint[][];
        let bign: bigint;

        let witnessGood1: number[] = this.generateWitnessType(witness, square);

        let witnessData: WitnessDataDto[] = [];

        for (let i: number = 0; i < witness.length; i++) {
            let d: WitnessDataDto = new WitnessDataDto();

            d.location = witness[i];
            d.witnessGood = witnessGood1[i];
            d.witnessRestClear = true;
            d.witnessRestFlag = true;
            d.currentFlags = this.boardState.countAdjacentConfirmedFlags(d.location);
            d.alwaysSatisfied = iterator.witnessAlwaysSatisfied(d.location);

            witnessData[i] = d;
        }

        let sample: number[] = iterator.getSample();
        let tally: number[] = new Array<number>(square.length);

        for (let i: number = 0; i < tally.length; i++) {
            tally[i] = 0;
        }

        let candidates: number = 0;

        this.workRestNotFlags = new Array<boolean>(witnessData.length);
        this.workRestNotClear = new Array<boolean>(witnessData.length);

        while (null !== sample) {
            if (this.checkSample(sample, square, witnessData)) {
                for (let i: number = 0; i < sample.length; i++) {
                    tally[sample[i]]++;
                }

                candidates++;
            }

            sample = iterator.getSample();
        }

        let bigTally: bigint[] = new Array<bigint>(square.length);

        for (let i: number = 0; i < square.length; i++) {
            bigTally[i] = ! isNaN(tally[i]) ? BigInt(tally[i]) : 0n;
        }

        bign = BigInt(candidates);

        let output: CrunchResultDto = new CrunchResultDto();

        output.setSquare = square;
        output.bigDistribution = bigDistribution;
        output.originalNumMines = iterator.getBalls;
        output.bigGoodCandidates = bign;
        output.bigTally = bigTally;

        output.witness = new Array<LocationDto>(witnessData.length);
        output.witnessGood = new Array<number>(witnessData.length);
        output.witnessRestClear = new Array<boolean>(witnessData.length);
        output.witnessRestFlags = new Array<boolean>(witnessData.length);

        for (let i: number = 0; i < witnessData.length; i++) {
            output.witness[i] = witnessData[i].location;
            output.witnessGood[i] = witnessData[i].witnessGood;
            output.witnessRestClear[i] = witnessData[i].witnessRestClear;
            output.witnessRestFlags[i] = witnessData[i].witnessRestFlag;
        }

        return output;
    }

    private generateWitnessType(witness: LocationDto[], square: LocationDto[]): number[]
    {
        let result: number[] = new Array<number>(witness.length);

        for (let i: number = 0; i < witness.length; i++) {
            result[i] = 0;

            for (const l of this.boardState.getAdjacentUnrevealedSquares(witness[i])) {
                let found: boolean = false;

                for (const squ of square) {
                    if (l.equals(squ)) {
                        found = true;
                        break;
                    }
                }

                if (! found) {
                    result[i]++;
                }
            }
        }

        return result;
    }

    private checkSample(sample: number[], square: LocationDto[], witnessData: WitnessDataDto[]): boolean
    {
        for (let i: number = 0; i < witnessData.length; i++) {
            this.workRestNotFlags[i] = false;
            this.workRestNotClear[i] = false;
        }

        let mine: LocationDto[] = new Array<LocationDto>(sample.length);

        for (let i: number = 0; i < sample.length; i++) {
            mine[i] = square[sample[i]];
        }

        for (let i: number = 0; i < witnessData.length; i++) {
            if (! witnessData[i].alwaysSatisfied) {
                let flags1: number = witnessData[i].currentFlags;
                let flags2: number = 0;

                for (let j: number = 0; j < mine.length; j++) {
                    if (mine[j].isAdjacent(witnessData[i].location)) {
                        flags2++;
                    }
                }

                let flags3 = this.boardState.getWitnessValue(witnessData[i].location);

                if (flags3 < flags1 + flags2) {
                    let d: WitnessDataDto = witnessData[0];
                    witnessData[0] = witnessData[i];
                    witnessData[i] = d;

                    return false;
                }

                if (0 === witnessData[i].witnessGood && flags3 !== flags1 + flags2) {
                    let d: WitnessDataDto = witnessData[0];
                    witnessData[0] = witnessData[i];
                    witnessData[i] = d;

                    return false;
                }

                if (flags3 !== flags1 + flags2) {
                    this.workRestNotClear[i] = true;
                }

                if (flags3 !== flags1 + flags2 + witnessData[i].witnessGood) {
                    this.workRestNotFlags[i] = true;
                }
            } else {
                if (0 !== witnessData[i].witnessGood) {
                    this.workRestNotFlags[i] = true;
                }
            }
        }

        for (let i: number = 0; i < witnessData.length; i++) {
            if (this.workRestNotClear[i]) {
                witnessData[i].witnessRestClear = false;
            }
            if (this.workRestNotFlags[i]) {
                witnessData[i].witnessRestFlag = false;
            }
        }

        return true;
    }

    private checkBigTally(output: CrunchResultDto, method: StrategyType): number
    {
        let result: number = 0;

        if (0n === output.bigGoodCandidates) {
            return 0;
        }

        for (let i: number = 0; i < output.bigTally.length; i++) {
            if (0.01 >= Math.abs(Number(output.bigTally[i]) - Number(output.bigGoodCandidates))) {
                let l: LocationDto = output.getSquare[i];

                if (! this.boardState.alreadyActioned(l)) {
                    result++;

                    this.boardState.setAction = new ActionDto(l, ActionType.Flag, method, 1);
                }
            } else if (0n === output.bigTally[i]) {
                const l: LocationDto = output.getSquare[i];

                if (! this.boardState.alreadyActioned(l)) {
                    result++;

                    this.boardState.setAction = new ActionDto(l, ActionType.Clear, method, 1);
                }
            }
        }

        return result;
    }

    private checkWitnesses(output: CrunchResultDto, method: StrategyType): number
    {
        let result: number = 0;

        for (let i: number = 0; i < output.witnessRestFlags.length; i++) {
            if (0 !== output.witnessGood[i]) {
                if (output.witnessRestFlags[i]) {
                    result += this.restKnown(output.witness[i], output.getSquare, ActionType.Flag, method);
                }
                if (output.witnessRestClear[i]) {
                    result += this.restKnown(output.witness[i], output.getSquare, ActionType.Clear, method);
                }
            }
        }

        return result;
    }

    private restKnown(witness: LocationDto, square: LocationDto[], type: ActionType, method: StrategyType): number
    {
        let result: number = 0;

        for (const l of this.boardState.getAdjacentSquaresIterable(witness)) {
            if (! this.boardState.isRevealed(l) && ! this.boardState.isConfirmedFlag(l)) {
                let found: boolean = false;

                for (const k of square) {
                    if (l.equals(k)) {
                        found = true;
                        break;
                    }
                }

                if (! found && ! this.boardState.alreadyActioned(l)) {
                    let act: ActionDto;

                    if (ActionType.Flag === type) {
                        act = new ActionDto(l, ActionType.Flag, method, 1);
                    } else {
                        act = new ActionDto(l, ActionType.Clear, method, 1);
                    }

                    result++;

                    this.boardState.setAction = act;
                }
            }
        }

        return result;
    }
}