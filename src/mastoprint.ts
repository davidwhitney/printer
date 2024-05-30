import { EpsonLX350CompatiblePrinter } from './printing/EpsonLX350CompatiblePrinter';
import { initialiseFileSystem, openUsbDevice } from './util';
import { processFiles } from './printing/processFiles';

console.log("-----------------------------");
console.log("🖨️       It's printing time!");
console.log("-----------------------------");

initialiseFileSystem();

const device = await openUsbDevice();
const printer = new EpsonLX350CompatiblePrinter(device);

await printer.text("MastoPrint Started").flush();

while (true) {
    await processFiles(printer);
    await new Promise(r => setTimeout(r, 5000));
}

printer.feed().close();
device.close();
