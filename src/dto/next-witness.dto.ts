import WitnessDto from './witness.dto';
import BoxDto from './box.dto';

export default class NextWitnessDto
{
    public witness: WitnessDto;
    public newBoxes: BoxDto[] = [];
    public oldBoxes: BoxDto[] = [];

    public constructor(witness: WitnessDto)
    {
        this.witness = witness;

        this.init();
    }

    private init(): void
    {
        for (const b of this.witness.getBoxes) {
            if (b.isProcessed) {
                this.oldBoxes.push(b);
            } else {
                this.newBoxes.push(b);
            }
        }
    }
}
