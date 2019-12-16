Architecturally I would expect a game controlling structure to be simple,
just as a "thin" controller. If necessary, it would cache the results of
calculations from any step, to pass these results to the constructor of a
next strategy/step. So that the next, more advanced strategy, could compare 
these results with it own ones. And make a decision of which solution is
more beneficial in the general scope of the game, given assumed next moves.

