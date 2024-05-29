import * as fs  from 'node:fs';
import { Printer, Image, BitmapDensity } from "@node-escpos/core";
import { ExtendedPrinter } from './ExtendedPrinter';
import { openUsbDevice } from './util';
import printToot from './printing/printToot';

if (!fs.existsSync('done/')) {
    console.error("🚨 no done folder.")
    process.exit(1);
}

if (!fs.existsSync('out/')) {
    console.error("🚨 no out folder.")
    process.exit(1);
}

console.log("It's printing time!");

const device = await openUsbDevice();
const printer = new ExtendedPrinter(device);    

printer.initialise()
printer
    .text("MastoPrint Started")
    .flush()            


while(true) {
    const now = new Date().getTime();
    const filenames = fs.readdirSync("out/");
    const filesThatAreTextOrJson = filenames.filter(file => file.endsWith(".txt") || file.endsWith(".json"));
    const fileNamesAndStats = filesThatAreTextOrJson.map(file => {
        return { file, stats: fs.statSync(`out/${file}`) }
    });

    const filesOlderThanTenSeconds = fileNamesAndStats.filter(file => {
        return new Date().getTime() > new Date(file.stats.ctime).getTime() + 10000
    });

    printer.initialise();

    for (const { file, stats } of filesOlderThanTenSeconds) {
        const filetype = file.split('.').pop();
        const contents = fs.readFileSync(`out/${file}`, 'utf8');

        console.log(`Processing file: ${file}`);
        console.log("Filetype: ", filetype);
        console.log("Contents: ", contents);

        switch(filetype) {
            case "txt":
                await printer.text(contents).flush();
                break;
            case "json":
                await printToot(printer, contents);
                break;
            default:
                console.error("Unknown filetype: ", filetype);
                continue;
        }
        
        fs.renameSync('out/'+file, 'done/'+file);
        console.log(`Moved file: out/${file} to done/${file}`);
    }
        
    console.log("\n\n⏰ pause")
    await new Promise(r => setTimeout(r, 5000));

} // while true

printer.feed().close();
device.close();

/*
* Ths function is taken from https://liza.io/splitting-text-into-lines-according-to-maximum-width-vertical-text-scroll-in-javascript-and-html5/
* and has been slightly modified to output a string separated by newlines
*/
function splitLines(text: string, maxTextWidth: number) {
    // Split text into words by spaces
    var words = text.split(' ');
    var lastWord = words[words.length - 1];
    var lineWidth = 0;
    var wordWidth = 0;
    var thisLine = '';
    var allLines = new Array();

    // For every element in the array of words
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        // Add current word to current line
        thisLine = thisLine.concat(word + ' ');
        // Get width of the entire current line
        lineWidth = thisLine.length;
        // If word is not the last element in the array
        if (word !== lastWord) {
            // Find out what the next upcoming word is
            var nextWord = words[i + 1];

            // Check if the current line + the next word would go over width limit
            if (lineWidth + nextWord.length >= maxTextWidth) {
                // If so, add the current line to the allLines array
                // without adding the next word
                addToAllLines(thisLine);
            } 

            // '~' indicates inserting a blank line, if required
            else if (word === '~') {
                addToAllLines(' ');
            }

            // If the next word is a line break, end line now
            else if (nextWord === '~') {
                addToAllLines(thisLine);
            }
        }

        // If this IS the last word in the array
        else {
            // Add this entire line to the array and return allLines
            addToAllLines(thisLine);
            
            return allLines.join("\n");
        }
    }

    // Function that adds text to the array of all lines
    function addToAllLines(text) {
        allLines.push(text);
        thisLine = '';
        lineWidth = 0;
    }
}