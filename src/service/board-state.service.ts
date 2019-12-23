import ServiceInterface from '../interface/service.interface';

import ActionDto, {ActionType} from '../dto/action.dto';
import BoardDto from '../dto/board.dto';
import BoardStateDto from '../dto/board-state.dto';
import LocationDto from '../dto/location.dto';
import {whileLoopOverBoardDo} from "../routine/while.loop-over-board.do";
import {AdjacentSquaresDto} from "../dto/adjacent-squares.dto";
import {whileLoopAroundTileDo} from "../routine/while.loop-around-tile.do";
import {StrategyType} from "../strategy/abstract-strategy";

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
        this.boardState.adjFlagsOnBoard = new Array<number[]>(this.boardState.height - 1)
            .fill(new Array<number>(this.boardState.width).fill(0));

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
        const height: number = boardState.height - 1;
        const width: number = boardState.width - 1;

        boardState.action = new Array<ActionDto[]>(height).fill(new Array<ActionDto>(width).fill(undefined));
        boardState.flagOnBoard = new Array<boolean[]>(height).fill(new Array<boolean>(width).fill(false));
        boardState.adjFlagsOnBoard = new Array<number[]>(height).fill(new Array<number>(width).fill(0));
        boardState.flagConfirmed = new Array<boolean[]>(height).fill(new Array<boolean>(width).fill(false));
        boardState.revealed = new Array<boolean[]>(height).fill(new Array<boolean>(width).fill(false));
        boardState.board = new Array<number[]>(height).fill(new Array<number>(width).fill(-1));
        boardState.adjFlagsConfirmed = new Array<number[]>(height).fill(new Array<number>(width).fill(0));
        boardState.adjacentLocations1 = new Array<AdjacentSquaresDto[]>(height)
            .fill(new Array<AdjacentSquaresDto>(width).fill(undefined));

        BoardStateService.initAdjacentUnrevealed(boardState);
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

    private static initAdjacentUnrevealed(boardState: BoardStateDto): void
    {
        boardState.adjUnrevealed = new Array<number[]>(boardState.height - 1)
            .fill(new Array<number>(boardState.width - 1).fill(0));

        whileLoopOverBoardDo(boardState, (location) => {
            boardState.adjUnrevealed[location.y][location.x] = BoardStateService.getInitAdjacentCountByLocation(
                location,
                boardState.height,
                boardState.width
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
