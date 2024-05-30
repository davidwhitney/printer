import 'dotenv/config'
import Mastodon from 'mastodon-api'
import { MastodonEvent } from '../types';

export default class MastodonStreamer {
    private accessToken: string;
    private apiURL: string;
    private hashTags: string[];

    constructor(accessToken: string, hashtags: string[], apiURL: string = "https://chaos.social/api/v1/") {
        this.accessToken = accessToken;
        this.hashTags = hashtags;
        this.apiURL = apiURL;
    }

    public start(onEvent: (eventType: string, msg: MastodonEvent) => void) {
        console.log("Starting Mastodon Streamer");

        // you need a .env file with ACCESS_TOKEN="youraccesstoken" in it
        const M = new Mastodon({
            access_token: this.accessToken,
            timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
            api_url: this.apiURL
        });

        const streams = [
            ...this.hashTags.map(tag => M.stream('streaming/hashtag', { tag })),
            M.stream('streaming/user')
        ];

        streams.forEach(stream => {
            stream.on('connected', (msg: MastodonEvent) => { onEvent('connected', msg); });
            stream.on('error', (msg: any) => { onEvent('error', msg); });
            stream.on('reconnect', (msg: any) => { onEvent('reconnect', msg); });
            stream.on('disconnect', (msg: any) => { onEvent('disconnect', msg); });
            stream.on('message', async (msg: MastodonEvent) => { onEvent('message', msg); });
        });

        return this;
    }
}