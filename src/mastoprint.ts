import { EpsonLX350CompatiblePrinter, IEpsonLX350CompatiblePrinter } from './printing/EpsonLX350CompatiblePrinter';
import { initialiseFileSystem, openUsbDevice } from './util';
import { processFiles } from './printing/processFiles';
import DebuggingPrinter from './printing/DebuggingPrinter';
import USBAdapter from '@node-escpos/usb-adapter';

console.log("-----------------------------");
console.log("🖨️    It's printing time!    ");
console.log("-----------------------------");

initialiseFileSystem();

let device: USBAdapter;
let printer: IEpsonLX350CompatiblePrinter;

try {
    device = await openUsbDevice();
    printer = new EpsonLX350CompatiblePrinter(device);
} catch (e) {
    console.error(`Error opening device because '${e.message}', using debugging stub...`);
    printer = new DebuggingPrinter();
}

await printer.text("MastoPrint Started").flush();

async function startProcessing() {
    await processFiles(printer);
    setTimeout(startProcessing, 5000);
}

startProcessing();

process.on('SIGINT', () => {
    printer?.feed().close();
    device?.close();
    process.exit();
});