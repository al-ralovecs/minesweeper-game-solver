import ServiceInterface from '../interface/service.interface';

import ActionDto, {ActionType} from '../dto/action.dto';
import BoardDto from '../dto/board.dto';
import BoardStateDto from '../dto/board-state.dto';
import LocationDto from '../dto/location.dto';

import {AdjacentSquaresDto} from "../dto/adjacent-squares.dto";
import {StrategyType} from "../strategy/abstract-strategy";

import whileLoopOverBoardDo from "../routine/while.loop-over-board.do";
import whileLoopAroundTileDo from "../routine/while.loop-around-tile.do";

export default class BoardStateService implements ServiceInterface
{
    private board: BoardDto;
    private readonly boardState: BoardStateDto;

    public constructor(height: number, width: number, expectedMinesCountOnBoard: number)
    {
        const boardState = new BoardStateDto(height, width, expectedMinesCountOnBoard);
        BoardStateService.init(boardState);

        this.boardState = boardState;
    }

    public set setBoard(board: BoardDto)
    {
        this.board = board;
    }

    public get getBoardState(): BoardStateDto
    {
        return this.boardState;
    }

    public process(): void
    {
        this.resetAdjacentUnrevealed();

        this.boardState.adjFlagsOnBoard = [...new Array<number[]>(this.boardState.height)]
            .map(() => new Array<number>(this.boardState.width).fill(0));

        this.boardState.actionList = [];

        whileLoopOverBoardDo(this.boardState, (location, i, j) => {
            this.boardState.flagOnBoard[i][j] = false;

            let info: number = this.board.data[i][j];
            let action: ActionDto = this.boardState.action[i][j];

            if (typeof action !== 'undefined'
                && null !== action
                && (
                    ! action.isCertainty
                    || StrategyType.FirstMove === action.moveMethod
                )
            ) {
                this.boardState.action[i][j] = null;
                action = null;
            }

            if (-1 === info) {
                if (this.boardState.flagConfirmed[i][j]) {
                    this.boardState.totalFlagsConfirmed++;
                    this.boardState.totalFlags++;
                } else {
                    this.boardState.numOfHidden++;
                }

                if (typeof action !== 'undefined'
                    && null !== action
                    && action.isCertainty
                    && ActionType.Flag !== action.getAction
                ) {
                    this.boardState.actionList.push(action);
                }

                return;
            }

            if (this.boardState.revealed[i][j]) {
                return;
            }

            this.boardState.livingWitnesses.add(location);
            this.boardState.revealed[i][j] = true;
            this.boardState.board[i][j] = info;

            whileLoopAroundTileDo(i, j, this.boardState.height, this.boardState.width, (y, x) => {
                this.boardState.adjUnrevealed[y][x]--;
            });
        });

        BoardStateService.leaveOnlyEdgeLivingWitnesses(this.boardState);
    }

    private static init(boardState: BoardStateDto): void
    {
        const height: number = boardState.height;
        const width: number = boardState.width;

        boardState.action = [...new Array<ActionDto[]>(height)].map(() => new Array<ActionDto>(width).fill(undefined));
        boardState.adjacentLocations1 = [...new Array<AdjacentSquaresDto[]>(height)]
            .map(() => new Array<AdjacentSquaresDto>(width).fill(undefined));
        boardState.board = [...new Array<number[]>(height)].map(() => new Array<number>(width).fill(-1));
        boardState.adjFlagsConfirmed = [...new Array<number[]>(height)].map(() => new Array<number>(width).fill(0));
        boardState.adjFlagsOnBoard = [...new Array<number[]>(height)].map(() => new Array<number>(width).fill(0));
        boardState.flagOnBoard = [...new Array<boolean[]>(height)].map(() => new Array<boolean>(width).fill(false));
        boardState.flagConfirmed = [...new Array<boolean[]>(height)].map(() => new Array<boolean>(width).fill(false));
        boardState.revealed = [...new Array<boolean[]>(height)].map(() => new Array<boolean>(width).fill(false));
    }

    private static leaveOnlyEdgeLivingWitnesses(boardState: BoardStateDto): void
    {
        let toRemove: LocationDto[] = [];

        boardState.livingWitnesses.data.forEach(l => {
            if (0 === boardState.countAdjacentUnrevealed(l)) {
                toRemove.push(l);
            }
        });

        boardState.livingWitnesses.removeAll(toRemove);
    }

    private resetAdjacentUnrevealed(): void
    {
        this.boardState.adjUnrevealed = [...new Array<Array<number>>(this.boardState.height)]
            .map(() => new Array<number>(this.boardState.width).fill(0));

        whileLoopOverBoardDo(this.boardState, (location) => {
            this.boardState.adjUnrevealed[location.y][location.x] = BoardStateService.getInitAdjacentCountByLocation(
                location,
                this.boardState.height,
                this.boardState.width
            );
        });
    }

    private static getInitAdjacentCountByLocation(location: LocationDto, height: number, width: number): number
    {
        const y: number = location.y;
        const x: number = location.x;

        if (0 === y && 0 === x
            || 0 === y && width - 1 === x
            || height - 1 === y && 0 === x
            || height - 1 === y && width - 1 === x
        ) {
            return 3;
        }

        if (0 === y
            || 0 === x
            || height - 1 === y
            || width - 1 === x
        ) {
            return 5;
        }

        return 8;
    }
}
