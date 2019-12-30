import ActionDto from '../../minesweeper/dto/action.dto';
import { StrategyType } from '../../minesweeper/strategy/abstract-strategy';

export class GameMoveDto {
    constructor(
        public readonly step: number,
        public readonly disposition: string,
        public readonly value?: ActionDto,
    ) {}

    toString(): string {
        return '\n' + this.step + '\n' +
            this.disposition +
            ( typeof this.value === 'undefined'
                    ? '(?, ?, ?)'
                    : `(${this.value.x}, ${this.value.y}, ${StrategyType[this.value.moveMethod]})`
            ) + ' \n';
    }
}
