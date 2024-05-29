import { BitmapDensity, Printer, Image } from "@node-escpos/core";
import { Adapter } from "@node-escpos/adapter";

export class ExtendedPrinter extends Printer<[]> {
    constructor(adapter: Adapter<[]>) {
        super(adapter, { encoding: "GB18030" })
    }

    public initialise() {        
        this.buffer.write("\x1B@");
        return this;
    }
    
    public async imageWithLineSpacing(image: Image, density?: BitmapDensity | undefined) {
        const defaultLineSpace = this.lineSpace;
        const lineSpace24 = (n?: number | null) => {
            this.buffer.write("\x1B\x33");
            this.buffer.writeUInt8(24);
            return this;
        }

        this.lineSpace = lineSpace24;
        await this.image(image, density);

        this.lineSpace = defaultLineSpace;
    }
  
}