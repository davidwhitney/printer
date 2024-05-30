import fs from 'fs';
import { EpsonLX350CompatiblePrinter } from './EpsonLX350CompatiblePrinter';
import { DONEDIR, OUTDIR } from '../util';
import printToot from './printToot';

export async function processFiles(printer: EpsonLX350CompatiblePrinter) {
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
}
