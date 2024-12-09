# Only Members

A Telegram bot that generates zero-knowledge proofs using Noir and allows users to verify that via a webapp.

## Quick Start

### Prerequisites
- go - https://go.dev/doc/install
- node.js - https://nodejs.org/en/download/package-manager
- yarn - https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable
- Nargo - https://noir-lang.org/docs/v0.35.0/getting_started/installation/

## Setup Steps

#### get your telegram bot token

1. Log in to your telegram account.

2. Find @BotFather in the contact search. It will help you create new bots and change settings for existing ones.

3. Press Start to begin chatting with the BotFather

4. Use the /newbot command to create a new bot. The BotFather will ask you for a name and username, then generate an authentication token for your new bot.

> The Username is a short name, to be used in mentions and t.me links. Usernames are 5-32 characters long and are case insensitive. Your bot’s username must end in ‘bot’, e.g. ‘noir_bot’ or ‘NoirBot’.

5. Once you enter everything that the BotFather asks for you will get a token. The token is a string along the lines of ~"110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw" that is required to authorize the bot and send requests to the Bot API. Keep your token secure and store it safely, it can be used by anyone to control your bot.


#### clone the repository:
```bash
git clone git@github.com:casiojapi/noir-telegram-bot.git
cd noir-telegram-bot 
```

#### set up proving server 
```bash
cd prover-server
```
+ install dependencies 
```bash
yarn install
```

+ start the proving server:
```bash
node server.js
```

#### set up telegram bot
+ open a new terminal inside noir-telegram-bot
```bash
cd tg-bot
```
+ export telegram token environment variable:
```bash
export TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
```

5. start the telegram bot:
```bash
go run main.go
```

The bot should now be running and responding to the `/proof` command.

## customize your circuit

nargo compile 
$ bb write_vk -b target/circuit.json -o target/circuit_vk


## Project Components

### user flow

1. User sends `/proof` command to the Telegram bot
2. Bot sends request to proving server
3. Server generates zero-knowledge proof
4. Bot receives proof and saves it as JSON
5. Bot sends proof file to user
6. Bot provides verifying link
7. User can verify their proofs via webapp

## Development

To modify the circuit:
1. Edit the circuit code in `proving-server/circuit/src/main.nr`
2. Compile using Nargo:
```bash
nargo compile
```
