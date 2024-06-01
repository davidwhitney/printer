import 'dotenv/config'
import MastodonStreamer from './toots/MastodonStreamer';
import { connectToPrinter } from './printing/connectToPrinter';
import { processSingleMessage } from './printing/processSingleMessage';
import InMemoryPrintQueue from './printing/inMemoryPrintQueue';
import { Entity } from 'megalodon';

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
const streamer = new MastodonStreamer("https://chaos.social", accessToken, ['emfcamp', 'emf2024', 'mastodot']);

queue.push("MastoPrint Started");
queue.push("Mastodot - The Mastodon Dot Matrix Printer\nBy Matt Gray | mattg.co.uk\n");

streamer.start((msg: Entity.Status) => {
    console.log("Received", msg.account.display_name, msg.content);
    queue.push(msg);
});

queue.processQueue(async (filetype: string, contents: string) => {
    await processSingleMessage(printer, filetype, contents);
});

process.on('SIGINT', () => {
    printer?.feed().close();
    device?.close();
    streamer.stop();
    process.exit();
});
