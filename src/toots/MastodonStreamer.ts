import 'dotenv/config'
import { Entity, Mastodon } from 'megalodon'

export default class MastodonStreamer {
    private accessToken: string;
    private apiURL: string;
    private hashTags: string[];
    private client: Mastodon;

    private streams: any[] = [];

    constructor(accessToken: string, hashtags: string[], apiURL: string = "https://chaos.social") {
        this.accessToken = accessToken;
        this.hashTags = hashtags;
        this.apiURL = apiURL;

        this.client = new Mastodon(this.apiURL, this.accessToken);

        console.log(`MastodonStreamer created with ${this.accessToken} and ${this.hashTags}`);

        this.streams = [];
    }

    public async start(onEvent: (msg: Entity.Status) => void) {
        console.log("Starting Mastodon Streamer");

        this.streams = [];

        for (const hashTag of this.hashTags) {
            console.log(`Starting stream for ${hashTag}`);

            const stream = await this.client.tagStreaming(hashTag);
            stream.on('connect', () => { console.log('connected'); });
            stream.on('close', () => { console.log('closed'); });
            stream.on('update', async (msg: Entity.Status) => { onEvent(msg); });
            stream.on('parser-error', (msg: Error) => { console.error(msg); });
            this.streams.push(stream);
        }

        return this;
    }
}