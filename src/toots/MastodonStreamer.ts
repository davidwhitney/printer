import 'dotenv/config'
import Mastodon from 'mastodon-api'
import { MastodonEvent } from '../types';

export default class MastodonStreamer {
    private accessToken: string;
    private apiURL: string;
    private hashTags: string[];
    private client: any;

    private streams: any[] = [];

    constructor(accessToken: string, hashtags: string[], apiURL: string = "https://chaos.social/api/v1/") {
        this.accessToken = accessToken;
        this.hashTags = hashtags;
        this.apiURL = apiURL;

        this.client = new Mastodon({
            access_token: this.accessToken,
            timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
            api_url: this.apiURL,
        });

        console.log(`MastodonStreamer created with ${this.accessToken} and ${this.hashTags}`);

        this.streams = [];
    }

    public start(onEvent: (eventType: string, msg: MastodonEvent) => void) {
        console.log("Starting Mastodon Streamer");

        this.streams = [
            ...this.hashTags.map(tag => this.client.stream('streaming/hashtag', { tag })),
            this.client.stream('streaming/user')
        ];

        this.streams.forEach(stream => {
            stream.on('connected', (msg: MastodonEvent) => { onEvent('connected', msg); });
            stream.on('reconnect', (msg: any) => { onEvent('reconnect', msg); });
            stream.on('disconnect', (msg: any) => { onEvent('disconnect', msg); });
            stream.on('message', async (msg: MastodonEvent) => { onEvent('message', msg); });
            stream.on('error', (msg: any) => {
                throw new Error(`Error in Mastodon Streamer: ${JSON.stringify(msg)}`);
            });
        });

        return this;
    }
}