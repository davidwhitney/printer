import { IEpsonLX350CompatiblePrinter } from './EpsonLX350CompatiblePrinter';
import printToot from './printToot';

export async function processSingleMessage(printer: IEpsonLX350CompatiblePrinter, filetype: string, contents: string) {
    console.log("Filetype: ", filetype);
    console.log("Contents: ", contents);

    try {
        filetype === "txt"
            ? await printer.text(contents).flush()
            : await printToot(printer, contents);
    } catch (e) {
        console.error(`Error processing message: `, e);
    }
}