import Board from '../Entities/Board';
import segregate from './Segregate';

export default class BruteForce {

  static get Defaults () {
    return {
      bruteForceLimit: 8,
    };
  }

  constructor(opts) {
    this.options = {...this.constructor.Defaults, opts};

    this.boardHeight = this.options.boardHeight;
    this.boardWidth = this.options.boardWidth;
  }

  /**
   * @param board Board
   */
  updateBoard(board) {
    this.board = board;
  }

  /**
   *
   * @param board Board
   */
  solve(board) {
    this.updateBoard(board);

    let borderTiles = this.borderTiles;
    const allEmptyTiles = this.allEmptyTiles;

    let borderOptimization = false;
    if (allEmptyTiles.length - borderTiles.length > this.options.bruteForceLimit) {
      borderOptimization = true;
    } else {
      borderTiles = allEmptyTiles;
    }

    if (borderTiles.length === 0) {
      throw Error();
    }

    let segregated = [];
    if (! borderOptimization) {
      segregated.push(borderTiles);
    } else {
      segregated = segregate(borderTiles);
    }


  }

  /**
   * @returns {Array}
   */
  get allEmptyTiles() {
    if (typeof this.board === 'undefined') {
      throw Error();
    }

    let result = [];

    for (let i = 0; i < this.boardWidth; i++) {
      for (let j = 0; j < this.boardHeight; j++) {
        if (this.board.getCell(i, j) === -1 && !this.board.hasMine(i, j)) {
          result.push(`x${i}y${j}`);
        }
      }
    }

    return result;
  }

  /**
   * @returns {Array}
   */
  get borderTiles() {
    if (typeof this.board === 'undefined') {
      throw Error();
    }

    let result = [];

    for (let i = 0; i < this.boardWidth; i++) {
      for (let j = 0; j < this.boardHeight; j++) {
        if (this.board.isBoundary(i, j) && !this.board.hasMine(i, j)) {
          result.push(`x${i}y${j}`);
        }
      }
    }

    return result;
  }


}
