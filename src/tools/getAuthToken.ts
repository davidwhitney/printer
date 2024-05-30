import 'dotenv/config'
import open from 'open';
import { OAuth2 } from 'oauth';
import readline from 'readline/promises';

const clientId = process.env.CLIENT_KEY;
const clientSecret = process.env.CLIENT_SECRET;
const instanceUrl = process.env.INSTANCE_URL;

var oauth = new OAuth2(clientId, clientSecret, instanceUrl, null, '/oauth/token');
var url = oauth.getAuthorizeUrl({
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    response_type: 'code',
    scope: 'read'
});

open(url);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const authCode = await rl.question(`Paste the auth code here:`);


oauth.getOAuthAccessToken(authCode, {
    grant_type: 'authorization_code',
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
}, function (err, accessToken, refreshToken, res) {
    console.log(accessToken);
});