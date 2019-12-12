import BoardDto from '../dto/board.dto';
import PerimeterListsListDto from '../dto/perimeter-lists-list.dto';
import {MarginDto} from "../dto/margin.dto";

export class PerimeterListsComputation {
    private readonly board: BoardDto;

    public data: PerimeterListsListDto;
    public topToBottomPriority: boolean = true;

    public used: number[][];

    public lists: number = 0;
    public listNext: number = 0;
    public neighborNext: number = 0;

    public listStart: number[] = [];
    public listEnd: number[] = [];

    public neighborStart: number[] = [];
    public neighborEnd: number[] = [];

    public enclosed: boolean[] = [];
    public dead: boolean[] = [];

    private nonPerimeterProbability: number;

    public constructor(board: BoardDto)
    {
        this.board = board;

        this.init();
    }

    public create(): void
    {
        if (this.topToBottomPriority) {
            for (let x: number = 0; x< this.board.width; x++) {
                for (let y: number = 0; y < this.board.height; y++) {
                    this.startList(y, x);
                }
            }
        } else {
            for (let y: number = 0; y < this.board.height; y++) {
                for (let x: number = 0; x< this.board.width; x++) {
                    this.startList(y, x);
                }
            }
        }
    }

    private startList(y: number, x: number): void
    {
        if (0 <= this.used[y][x]
            || 0 <= this.board.exposed[y][x]
            || 0 === this.board.neighbors[y][x]
        ) {
            return;
        }

        this.listStart[this.lists] = this.listNext;
        this.enclosed[this.lists] = true;
        this.dead[this.lists] = true;
        this.neighborStart[this.lists] = this.neighborNext;

        this.createList(y, x);

        this.neighborEnd[this.lists] = this.neighborNext - 1;
        this.listEnd[this.lists] = this.listNext - 1;
        this.lists++;
    }

    private createList(y: number, x: number, endGame: boolean = false): void
    {
        this.used[y][x] = this.listNext;
        this.data.initItem = this.listNext;
        this.data.current.y = y;
        this.data.current.x = x;
        this.data.current.neighborCount = 0;
        this.data.current.adjacentListCount = 0;
        this.data.current.isDead = false;
        this.data.current.similarListsIndex = undefined;

        if (this.data.current.index !== this.listStart[this.lists]) {
            this.data.previous.nextListIndex = this.data.current.index;
        }

        this.data.current.nextListIndex = this.listStart[this.lists];

        this.data.current.index = this.lists;
        this.data.current.tried = -1;
        this.data.current.merged = -1;
        this.listNext++;

        if (endGame) {
            this.data.current.probability = this.nonPerimeterProbability;
        }

        const m: MarginDto = new MarginDto(y, x, this.board.height, this.board.width);

        for (let i: number = y + m.top; i < y + m.bottom; i++) {
            for (let j: number = x + m.left; j < x + m.right; j++) {
                if (i === y && j === x) {
                    continue;
                }

                if (0 < this.board.exposed[i][j] && 9 > this.board.exposed[i][j]) {
                    this.addNeighbor(i, j);
                    this.checkNeighbors(i, j);
                }
            }
        }
    }

    private addNeighbor(y: number, x: number): void
    {

    }

    private checkNeighbors(y: number, x: number): void
    {

    }

    private init(): void
    {
        for (let i: number = 0; i < this.board.height; i++) {
            this.used[i] = [];

            for (let j: number = 0; j < this.board.width; j++) {
                this.used[i][j] = -1;
            }
        }
    }
}
