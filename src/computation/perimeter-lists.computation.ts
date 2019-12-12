import BoardDto from '../dto/board.dto';
import PerimeterListsListDto from '../dto/perimeter-lists-list.dto';
import {MarginDto} from "../dto/margin.dto";
import {createPerimeterListAndPopulateWithDefaults} from "../routine/perimeter-list.populate-with-defaults";
import {NeighborDto} from "../dto/neighbor.dto";

export class PerimeterListsComputation {
    private readonly board: BoardDto;

    public perimeter: PerimeterListsListDto;
    public neighbor: NeighborDto[];

    public topToBottomPriority: boolean = true;

    public used: number[][];

    public listsCount: number = 0;
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

        this.listStart[this.listsCount] = this.listNext;
        this.enclosed[this.listsCount] = true;
        this.dead[this.listsCount] = true;
        this.neighborStart[this.listsCount] = this.neighborNext;

        this.createList(y, x);

        this.neighborEnd[this.listsCount] = this.neighborNext - 1;
        this.listEnd[this.listsCount] = this.listNext - 1;

        this.listsCount++;
    }

    private createList(y: number, x: number, endGame: boolean = false): void
    {
        this.used[y][x] = this.listNext;

        this.perimeter.add(
            this.listNext,
            createPerimeterListAndPopulateWithDefaults(y, x, this.listsCount, this.listStart[this.listsCount])
        );

        if (this.perimeter.current.index !== this.listStart[this.listsCount]) {
            this.perimeter.previous.nextListIndex = this.perimeter.current.index; // .previous()  =?= (list - 1)->next
        }

        this.listNext++;

        if (endGame) {
            this.perimeter.current.probability = this.nonPerimeterProbability;
            return;
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
        const next: NeighborDto = new NeighborDto();
        this.neighbor[this.listsCount] = next;



        /**
         void AddNeighbor(List * list, int x, int y)
         {
	Neighbor * next = &neighborArray[lists];
	for (; next < &neighborArray[neighborNext]; next++)
	{
		if (next->x == x && next->y == y)
			goto FOUND;										// already on the list
	}
	neighborNext++;
	next->x = x;
	next->y = y;
	next->unexposed = unexposed[y][x];
	next->needed = needed[y][x];
	next->count = 0;
FOUND:
	next->entries[next->count++] = list;
	list->neighbors[list->numNeighbors] = next;
	list->numNeighbors++;
}
         */
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
