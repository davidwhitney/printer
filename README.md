# Mastodot - Mastodon on a Dot Matrix Printer

This is being made as an installation for [Electromagnetic Field Festival](https://emfcamp.org)

## Usage

You'll need to install the dependencies first:

```bash
npm install
```

Then run:

```bash
npm run start
```

The running program buffers incoming toots and prints them out on the dot matrix printer.

## Setup

You need a Mastodon account and an access token. You can get an access token by going to your Mastodon settings, then to Development, and creating a new application. You can then use the access token to authenticate with the Mastodon API.

You'll need to create a `.env` file in the root of the project with the following contents:

```bash
INSTANCE_URL=https://mastodon.social
ACCESS_TOKEN=your_access_token
```

If you're confused and need an access token, once you've created a Mastodon app in your account, you can run:

```bash
npm run getToken
```

And it'll guide you through the process of getting an access token using the client ID and client secret of your app. To run `getToken` you need to add a few extra environment variables to your `.env` file:

```bash
CLIENT_KEY=your_client_key
CLIENT_SECRET=your_client_secret
```

The script will launch your web browser and ask you to paste a code in the command line. Once you've done that, it'll print out your access token.
