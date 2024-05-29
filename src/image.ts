import { Image } from "@node-escpos/core";
import { openUsbDevice } from "./util";
import { EpsonLX350CompatiblePrinter } from "./printing/EpsonLX350CompatiblePrinter";

console.log("It's printing time!");

const image = await Image.load("./blessed.jpg");
console.log("Image loaded, size:", image.size);

const device = await openUsbDevice();
const printer = new EpsonLX350CompatiblePrinter(device);

await printer.imageWithLineSpacing(image, "s8");

printer.feed().close();
device.close();
