import DebuggingPrinter from "./DebuggingPrinter";
import printToot from "./printToot";
import { describe, beforeEach, it } from 'vitest';

describe('printToot', () => {
    let printer: DebuggingPrinter;

    beforeEach(() => {
        printer = new DebuggingPrinter();
    });

    it('prints a toot', async () => {
        await printToot(printer, JSON.stringify(toot));
    });

});

const toot = {
    "id": "112538305048949033",
    "uri": "https://mastodon.social/users/some_user/statuses/112538305048949033",
    "url": "https://mastodon.social/@some_user/112538305048949033",
    "account": {
        "id": "109244461409790536",
        "username": "some_user",
        "acct": "some_user",
        "display_name": "David Whitney",
        "locked": false,
        "bot": false,
        "discoverable": true,
        "indexable": false,
        "group": false,
        "created_at": "2022-10-28T00:00:00.000Z",
        "note": "<p>Note/p>",
        "url": "https://mastodon.social/@some_user",
        "uri": "https://mastodon.social/users/some_user",
        "avatar": "https://files.mastodon.social/accounts/avatars/109/244/461/409/790/536/original/abc.jpg",
        "avatar_static": "https://files.mastodon.social/accounts/avatars/109/244/461/409/790/536/original/abc.jpg",
        "header": "https://files.mastodon.social/accounts/headers/109/244/461/409/790/536/original/abc.jpeg",
        "header_static": "https://files.mastodon.social/accounts/headers/109/244/461/409/790/536/original/abc.jpeg",
        "followers_count": 640,
        "following_count": 300,
        "statuses_count": 1000,
        "last_status_at": "2024-05-31",
        "hide_collections": false,
        "noindex": false,
        "emojis": [],
        "roles": [],
        "fields": [
            {
                "name": "Website",
                "value": "<a href=\"https://someuser.co.uk\" target=\"_blank\" rel=\"nofollow noopener noreferrer me\" translate=\"no\"><span class=\"invisible\">https://</span><span class=\"\">someuser.co.uk</span><span class=\"invisible\"></span></a>",
                "verified_at": null
            },
            {
                "name": "Instagram",
                "value": "someusercouk",
                "verified_at": null
            },
            {
                "name": "Twitter",
                "value": "some_user",
                "verified_at": null
            }
        ]
    },
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "reblog": null,
    "content": "<p><a href=\"https://mastodon.social/tags/testhashtag\" class=\"mention hashtag\" rel=\"tag\">#<span>testhashtag</span></a> foo</p>",
    "plain_content": null,
    "created_at": "2024-05-31T23:30:58.196Z",
    "edited_at": null,
    "emojis": [],
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "media_attachments": [],
    "mentions": [],
    "tags": [
        {
            "name": "testhashtag",
            "url": "https://mastodon.social/tags/testhashtag"
        }
    ],
    "card": null,
    "poll": null,
    "application": {
        "name": "Web",
        "website": null
    },
    "language": "en",
    "emoji_reactions": [],
    "bookmarked": false,
    "quote": false
}