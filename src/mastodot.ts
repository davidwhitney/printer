import 'dotenv/config'
import * as fs from 'node:fs/promises';
import { initialiseFileSystem, OUTDIR } from './util';
import MastodonStreamer from './toots/MastodonStreamer';

initialiseFileSystem();

const accessToken = process.env.ACCESS_TOKEN;
if (!accessToken) {
    console.error("No ACCESS_TOKEN found in .env file");
    process.exit(1);
}

await printText("Mastodot - The Mastodon Dot Matrix Printer\nBy Matt Gray | mattg.co.uk\n");

new MastodonStreamer(accessToken, ['emfcamp', 'emf2024', 'mastodot'])
    .start(saveEventsToDisk);

async function saveEventsToDisk(eventType: string, msg: any) {
    if (eventType === 'connected') {
        await printText('connected ' + msg.req.path);
    }

    if (eventType === 'message' && msg.event === 'update') {
        const toot = msg.data;
        const atts = toot.media_attachments?.map(att => `${att.type} - ${att.description}`).join('\n') || "";
        console.log(`${toot.account.display_name} (${toot.account.acct})\n${toot.content}\n${atts}\n\n`);

        await fs.writeFile(`${OUTDIR}/${Date.now()}.json`, JSON.stringify(toot));
    }
}

async function printText(text: string) {
    console.log(text);
    await fs.writeFile(`${OUTDIR}/${Date.now()}.txt`, text);
}
