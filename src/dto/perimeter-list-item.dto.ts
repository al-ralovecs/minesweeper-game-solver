import NeighborDto from './neighbor.dto';

export class PerimeterListItemDto
{
    public y: number;
    public x: number;

    public index: number;
    public merged: number;
    public tried: number;

    public isDead: boolean;
    public isCleared: boolean;

    public adjacentListCount: number;

    public minValue: number;
    public maxValue: number;

    public neighborCount: number;
    public similarCount: number;

    public similarListsIndex: number[];
    public nextListIndex: number;

    public possibleMinesCounts: number[];

    public probability: number;

    public neighborList: NeighborDto[];
}


/**
 struct List
 {
    int		x, y;							// position
    int		list;							// list number that this belongs to (before end play combines them)
    int		merged;							// list number if this merges with another list
    int		tried;							// < 0 if not tried yet, 0 if exposed, 1 if mine (see CreateSolutions())
    bool	dead;							// if this entry is dead
    bool	clear;							// this location is cleared (see fastSolve.cpp)
    int		adjacentLists;					// number of adjacentlists
    int		minValue;						// min value for this location
    int		maxValue;						// max values for this location
    int		numNeighbors;					// number of neighbors below
    int		numSimilar;						// number of similar entries
    struct List * similar;					// first list entries with the same neighbors
    struct List * next;						// next entry in the list (loops back to start)
    // counts[] required to be accurate for prob calculation
    int		counts[MAX_COUNTS];				// number of possible counts of mines (index using listMinMines[list])
    double	prob;							// probability of mine here
    Neighbor * neighbors[MAX_NEIGHBORS];	// pointer into neighbor array
};
 **/
