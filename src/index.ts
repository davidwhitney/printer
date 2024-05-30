import 'dotenv/config'
import MastodonStreamer from './toots/MastodonStreamer';
import { MastodonEvent } from './types';
import { connectToPrinter } from './printing/connectToPrinter';
import { processSingleMessage } from './printing/processFiles';
import InMemoryPrintQueue from './printing/inMemoryPrintQueue';

console.log("-----------------------------");
console.log("🖨️    It's printing time!    ");
console.log("-----------------------------");

const accessToken = process.env.ACCESS_TOKEN;
if (!accessToken) {
    console.error("No ACCESS_TOKEN found in .env file");
    process.exit(1);
}

const queue = new InMemoryPrintQueue();
const { device, printer } = await connectToPrinter();
const streamer = new MastodonStreamer(accessToken, ['emfcamp', 'emf2024', 'mastodot']);

queue.push("MastoPrint Started");
queue.push("Mastodot - The Mastodon Dot Matrix Printer\nBy Matt Gray | mattg.co.uk\n");

streamer.start((eventType: string, msg: MastodonEvent) => {
    console.log("Received", eventType, msg);

    if (eventType === 'connected') {
        queue.push('connected ' + msg.req.path);
    }

    if (eventType === 'message' && msg.event === 'update') {
        queue.push(msg.data);
    }
});

queue.processQueue(async (filetype: string, contents: string) => {
    await processSingleMessage(printer, filetype, contents);
});

process.on('SIGINT', () => {
    printer?.feed().close();
    device?.close();
    process.exit();
});
