import AbstractStrategy from "./IStrategy";
import Board from "../Entity/Board";

export default class GuessAsDoOrDie extends AbstractStrategy
{
    public constructor(board: Board, calcs: AbstractStrategy)
    {
        super(board);
    }
}