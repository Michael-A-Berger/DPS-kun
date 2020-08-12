# DPS-kun
A Discord bot for rhythm game communities.

# (!!!) WARNING (!!!)
This Discord bot is in very early development. While it is operational, it's very limited and there is a high possibility for errors to occur. Additionally, the bot has not been tested on multiple servers and command processing efficiency has not been addressed whatsoever. If you are a Discord server admin, I urge you to wait a bit longer to add this bot to your server.

If you are a web developer with a decent understanding of Node, you already know how to clone ths repository and there's nothing I can do stop you. If you would like to work with me on the project, **[open up a new issue](https://github.com/Michael-A-Berger/DPS-kun/issues/new/choose)** asking to collaborate and I'll get in contact ASAP.

# Roadmap

1. Add more commands
    - Daily setlist (Create list of randomly-chosen songs and post it every X hours)
    - Auto-Twitter posting (looks for non-retweet posts from rhythm game dev accounts + posts them to specified channel)
    - More Challenge sub-commands (for actually relevant rhythm games)
2. Get the bot ready for _public_ deployment
    - Reworking "Bot Master" commands
    - Implement landing websites
    - Centralized hosting (most likely Heroku)
3. Rework current features using Discord's **[Updated Bot API](https://blog.discord.com/the-future-of-bots-on-discord-4e6e050ab52e)**
    - Update goes live October 7th, 2020
4. Never. Stop. Developing.

# Deployment

1. Clone the project (`git clone <project_url>`)
2. Install the latest Node.js and Node Project Manager (NPM) versions
3. Install the runtime dependencies (`npm install --production`)
4. Define the environment variables (see `example.env` for necessary variables)
5. Run the command `npm start`

Just invite the bot to the desired Discord server and the bot is fully operational.