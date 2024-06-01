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
const instanceUrl = process.env.INSTANCE_URL || "https://chaos.social";
if (!accessToken) {
    console.error("No ACCESS_TOKEN found in .env file");
    process.exit(1);
}

const queue = new InMemoryPrintQueue();
const { device, printer } = await connectToPrinter();
const streamer = new MastodonStreamer(instanceUrl, accessToken, ['emfcamp', 'emf2024', 'mastodot']);

queue.push("MastoPrint Started");
queue.push("Mastodot - The Mastodon Dot Matrix Printer\nBy Matt Gray | mattg.co.uk\n");

queue.processQueueAsync(async (filetype: string, contents: string) => {
    await processSingleMessage(printer, filetype, contents);
});

streamer.startAsync((msg: Entity.Status) => {
    console.log("Received", msg.account.display_name, msg.content);
    queue.push(msg);
});

process.on('SIGINT', () => {
    printer?.feed().close();
    device?.close();
    streamer.stop();
    process.exit();
});
