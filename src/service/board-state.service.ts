import ActionDto from '../dto/action.dto';
import BoardDto from '../dto/board.dto';
import BoardStateDto from '../dto/board-state.dto';
import LocationDto from '../dto/location.dto';
import MarginDto from '../dto/margin.dto';

export default class BoardStateService
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
        for (let i: number = 0; i < this.boardState.height; i++) {
            this.boardState.adjFlagsOnBoard[i] = [];

            for (let j: number = 0; j < this.boardState.width; j++) {
                this.boardState.adjFlagsOnBoard[i][j] = 0;
            }
        }

        this.boardState.actionList = [];

        for (let i: number = 0; i < this.boardState.height; i++) {
            for (let j: number = 0; j < this.boardState.width; j++) {
                const location: LocationDto = new LocationDto(i, j);
                this.boardState.flagOnBoard[i][j] = false;
                let info: number = this.board.data[i][j];
                let act: ActionDto = this.boardState.action[i][j];

                // if (typeof act === 'undefined' && (
                //     ! act.isCertainty
                //     || MoveMethodEnum.BOOK === act.getMoveMethod
                // )) {
                //     this.boardState[i][j] = undefined;
                //     act = undefined;
                // }

                if (-1 !== info) {
                    // if (9 === info) {
                    //     this.boardState.totalFlags++;
                    //     this.boardState.flagOnBoard[i][j] = true;
                    //
                    //     let m: MarginDto = new MarginDto(i, j, this.boardState.height, this.boardState.width);
                    //
                    //     for (let k: number = i + m.top; k <= i + m.bottom; k++) {
                    //         for (let l: number = j + m.left; l <= j + m.right; l++) {
                    //             this.boardState.adjFlagsOnBoard[k][m]++;
                    //         }
                    //     }
                    // }
                    if (! this.boardState.revealed[i][j]) {
                        this.boardState.livingWitnesses.add(location);

                        this.boardState.revealed[i][j] = true;
                        this.boardState.board[i][j] = info;

                        let m: MarginDto = new MarginDto(i, j, this.boardState.height, this.boardState.width);

                        for (let k: number = m.top; k <= m.bottom; k++) {
                            for (let l: number = m.left; l <= m.right; l++) {
                                if (k === i && l === j) {
                                    continue;
                                }

                                this.boardState.adjUnrevealed[k][l]--;
                            }
                        }
                    }
                } else {
                    if (this.boardState.flagConfirmed[i][j]) {
                        this.boardState.totalFlagsConfirmed++;
                        this.boardState.totalFlags++;
                    } else {
                        this.boardState.numOfHidden++;
                    }

                    // if (typeof act !== 'undefined' && null !== act && act.isCertainty) {
                    //     if (act.getAction !== ActionEnum.FLAG) {
                    //         this.boardState.actionList.push(act);
                    //     }
                    // }
                }
            }
        }

        let toRemove: LocationDto[] = [];
        this.boardState.livingWitnesses.data.forEach(l => {
            if (0 === this.boardState.countAdjacentUnrevealed(l)) {
                toRemove.push(l);
            }
        });
        this.boardState.livingWitnesses.removeAll(toRemove);

        // this.boardState.actionList.forEach(a => {
        //    this.boardState.unPlayedMoves[a.getMoveMethod]++;
        // });
    }

    private static init(boardState: BoardStateDto): void
    {
        boardState.action = [];
        boardState.flagOnBoard = [];
        boardState.adjFlagsOnBoard = [];
        boardState.adjUnrevealed = [];
        boardState.flagConfirmed = [];
        boardState.revealed = [];
        boardState.board = [];
        boardState.adjFlagsConfirmed = [];
        boardState.adjacentLocations1 = [];

        for (let i: number = 0; i < boardState.height; i++) {
            boardState.action[i] = [];
            boardState.flagOnBoard[i] = [];
            boardState.adjFlagsOnBoard[i] = [];
            boardState.adjUnrevealed[i] = [];
            boardState.flagConfirmed[i] = [];
            boardState.revealed[i] = [];
            boardState.board[i] = [];
            boardState.adjFlagsConfirmed[i] = [];
            boardState.adjacentLocations1[i] = [];

            for (let j: number = 0; j < boardState.width; j++) {
                boardState.action[i][j] = undefined;
                boardState.flagOnBoard[i][j] = false;
                boardState.adjFlagsOnBoard[i][j] = 0;
                boardState.flagConfirmed[i][j] = false;
                boardState.revealed[i][j] = false;
                boardState.board[i][j] = -1;
                boardState.adjFlagsConfirmed[i][j] = 0;
                boardState.adjacentLocations1[i][j] = undefined;

                let adjacent: number = 8;

                if (0 === i && 0 === j
                    || 0 === i && boardState.width - 1 === j
                    || boardState.height - 1 === i && 0 === j
                    || boardState.height - 1 === i && boardState.width - 1 === j
                ) {
                    adjacent = 3;
                } else if (0 === i
                    || 0 === j
                    || boardState.height - 1 === i
                    || boardState.width - 1 === j
                ) {
                    adjacent = 5;
                }

                boardState.adjUnrevealed[i][j] = adjacent;
            }
        }
    }
}
