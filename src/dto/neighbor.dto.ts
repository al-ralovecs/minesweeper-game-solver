export class NeighborDto {
    public y: number;
    public x: number;

    public needed: number;
    public unexposed: number;

    public entryCount: number;
    public entryListsIndexes: number[];
}

/**
 struct Neighbor
 {
	int		x, y;							// position
	int		needed;							// number of mines needed
	int		unexposed;						// number of unexposed tiles around
	int		count;							// entries used below
	struct List * entries[MAX_NEIGHBORS];	// listArray entries using this neighbor
};
 **/