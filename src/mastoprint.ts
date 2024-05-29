import * as fs from 'node:fs';
import { EpsonLX350CompatiblePrinter } from './printing/EpsonLX350CompatiblePrinter';
import { DONEDIR, initialiseFileSystem, openUsbDevice, OUTDIR } from './util';
import printToot from './printing/printToot';

console.log("-----------------------------");
console.log("🖨️       It's printing time!");
console.log("-----------------------------");

initialiseFileSystem();

const device = await openUsbDevice();
const printer = new EpsonLX350CompatiblePrinter(device);

await printer.text("MastoPrint Started").flush();

while (true) {
    const now = new Date().getTime();

    const filenames = fs.readdirSync(OUTDIR);
    const filesThatAreTextOrJson = filenames.filter(file => file.endsWith(".txt") || file.endsWith(".json"));
    const fileNamesAndStats = filesThatAreTextOrJson.map(file => {
        return { file, stats: fs.statSync(`${OUTDIR}/${file}`) }
    });

    const filesOlderThanTenSeconds = fileNamesAndStats.filter(({ stats }) => {
        return now > new Date(stats.ctime).getTime() + 10000
    });

    printer.initialise();

    for (const { file } of filesOlderThanTenSeconds) {
        const filetype = file.split('.').pop();
        const contents = fs.readFileSync(`${OUTDIR}/${file}`, 'utf8');

        console.log(`Processing file: ${file}`);
        console.log("Filetype: ", filetype);
        console.log("Contents: ", contents);

        filetype === "txt"
            ? await printer.text(contents).flush()
            : await printToot(printer, JSON.parse(contents));

        fs.renameSync(`${OUTDIR}/${file}`, `${DONEDIR}/${file}`);
        console.log(`Moved file: ${OUTDIR}/${file} to ${DONEDIR}/${file}`);
    }

    console.log("\n\n⏰ pause");

    await new Promise(r => setTimeout(r, 5000));
}

printer.feed().close();
device.close();
