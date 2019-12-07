export default class Board {
  constructor(state) {
    this.state = state;

    this.tryFlagMines();
  }

  get height() {
    return this.state.length;
  }

  get width() {
    if (typeof this.boardWidth === 'undefined') {
      this.boardWidth = this.getBoardWidth();
    }

    return this.boardWidth;
  }

  getBoardWidth() {
    const width = this.state[0].length;

    if (this.height === 1) {
      return width;
    }

    for (let i = 1; i < this.height; i++) {
      if (width !== this.state[i].length) {
        throw Error();
      }
    }

    return width;
  }

  tryFlagMines() {
    let flags = [];

    for (let i = 0; i < this.height; i++) {
      let row = [];
      for (let j = 0; j < this.width; j++) {
        row.push(false);
      }
      flags.push(row);
    }

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let curNum = this.getCell(i, j);

        if (curNum < 1 || curNum !== this.countFreeSquaresAround(i, j)) {
          continue;
        }

        for (let ii = 0; ii < this.height; ii++) {
          for (let jj = 0; jj < this.width; jj++) {
            if (Math.abs(ii-i) <= 1 && Math.abs(jj-j) <= 1) {
              if (this.getCell(ii, jj) === -1 && ! flags[ii][jj]) {
                flags[ii][jj] = true;
              }
            }
          }
        }
      }
    }

    this.flags = flags;
  }

  getCell(y, x) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.state[y][x];
    }

    return -10;
  }

  hasMine(y, x) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.flags[y][x];
    }

    throw Error();
  }

  isBoundary(y, x) {
    if (this.getCell(y, x) !== -1) {
      return false;
    }

    const
      oU = y === 0,
      oD = y === (this.height - 1),
      oL = x === 0,
      oR = x === (this.width - 1);

    if (!oU && this.getCell(y-1, x) >= 0) {
      return true;
    }
    if (!oL && this.getCell(y, x-1) >= 0) {
      return true;
    }
    if (!oD && this.getCell(y+1, x) >= 0) {
      return true;
    }
    if (!oR && this.getCell(y, x+1) >= 0) {
      return true;
    }
    if (!oU && !oL && this.getCell(y-1, x-1) >= 0) {
      return true;
    }
    if (!oU && !oR && this.getCell(y-1, x+1) >= 0) {
      return true;
    }
    if (!oD && !oL && this.getCell(y+1, x-1) >= 0) {
      return true;
    }
    if (!oD && !oR && this.getCell(y+1, x+1) >= 0) {
      return true;
    }

    return false;
  }

  countFreeSquaresAround(y, x) {
    let result = 0;

    if (this.getCell(y-1, x) === -1) {
      result++;
    }
    if (this.getCell(y+1, x) === -1) {
      result++;
    }
    if (this.getCell(y, x-1) === -1) {
      result++;
    }
    if (this.getCell(y, x+1) === -1) {
      result++;
    }
    if (this.getCell(y-1, x-1) === -1) {
      result++;
    }
    if (this.getCell(y-1, x+1) === -1) {
      result++;
    }
    if (this.getCell(y+1, x-1) === -1) {
      result++;
    }
    if (this.getCell(y+1, x+1) === -1) {
      result++;
    }

    return result;
  }
}
