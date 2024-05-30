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
            api_url: this.apiURL
        });

        this.streams = [];
    }

    public start(onEvent: (eventType: string, msg: MastodonEvent) => void) {
        console.log("Starting Mastodon Streamer");

        this.streams = [];
        this.streams.push(...this.hashTags.map(tag => this.client.stream('streaming/hashtag', { tag })));
        this.streams.push(this.client.stream('streaming/user'));

        this.streams.forEach(stream => {
            stream.on('connected', (msg: MastodonEvent) => { onEvent('connected', msg); });
            stream.on('reconnect', (msg: any) => { onEvent('reconnect', msg); });
            stream.on('disconnect', (msg: any) => { onEvent('disconnect', msg); });
            stream.on('message', async (msg: MastodonEvent) => { onEvent('message', msg); });
            stream.on('error', (msg: any) => {
                if (msg instanceof Error && msg.message.includes("Invalid access token")) {
                    throw new Error(`Invalid access token. ${JSON.stringify(msg)}`);
                }
                onEvent('error', msg);
            });
        });

        return this;
    }
}