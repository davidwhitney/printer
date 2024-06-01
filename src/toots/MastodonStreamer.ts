import 'dotenv/config'
import { Entity, Mastodon } from 'megalodon'
import Streaming from 'megalodon/lib/src/mastodon/web_socket';

export default class MastodonStreamer {
    private hashTags: string[];
    private client: Mastodon;

    private streams: Streaming[];

    constructor(apiURL: string, accessToken: string, hashtags: string[]) {
        this.hashTags = hashtags;
        this.client = new Mastodon(apiURL, accessToken);
        this.streams = [];

        console.log(`MastodonStreamer created for ${this.hashTags}`);
    }

    public async startAsync(onEvent: (msg: Entity.Status) => void) {
        this.streams = [];

        for (const hashTag of this.hashTags) {
            console.log(`Starting stream for ${hashTag}`);

            const stream = await this.client.tagStreaming(hashTag);
            stream.on('connect', () => { console.log(`connected ${hashTag}`); });
            stream.on('close', () => { console.log(`closed ${hashTag}`); });
            stream.on('update', async (msg: Entity.Status) => { onEvent(msg); });
            stream.on('parser-error', (msg: Error) => { console.error(msg); });
            this.streams.push(stream);
        }

        return this;
    }

    public stop() {
        console.log("Stopping Mastodon Streamer");

        for (const stream of this.streams) {
            console.log(`Stopping stream with params: ${JSON.stringify(stream.params)}`);
            stream.stop();
            stream.removeAllListeners();
        }

        this.streams = [];
        return this;
    }
}