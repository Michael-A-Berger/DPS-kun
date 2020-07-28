# DPS-kun
A Discord bot for rhythm game communities.

# (!!!) WARNING (!!!)
This Discord bot is not 100% ready to go. The biggest ommissions are the following;

- Channel blacklisting
- Silent error logging (one small error results in the bot crashing)
- Centralized hosting (cloning the repo + run an independent instance are necessary)

If you are a Discord server admin, I urge you to **NOT** add this bot to your server. It requires a decent amount of web development knowledge to maintain, and (IMO) the benefits are not worth that investment.

If you are a web developer with a decent understanding of Node, you already know how to clone ths repository and there's nothing I can do stop you. If you would like to work with me on the project, **[open up a new issue](https://github.com/Michael-A-Berger/DPS-kun/issues/new/choose)** asking to collaborate and I'll get in contact ASAP.

# Roadmap

1. Get the bot ready for private deployment
    - Channel blacklisting
    - Silent error logging
2. Add more commands
    - Song info (search database -> ask user for clarification -> display song properties)
    - Daily setlist (Create list of randomly-chosen songs and post it every X hours)
    - Auto-Twitter posting (looks for non-retweet posts from rhythm game devs + posts them to specified channel)
    - More Challenge sub-commands (for actually relevant rhythm games)
3. Get the bot ready for _public_ deployment
    - Reworking "Bot Master" commands
    - Implement landing websites
    - Centralized hosting (most likely Heroku)
4. Rework current features using Discord's **[Updated Bot API](https://blog.discord.com/the-future-of-bots-on-discord-4e6e050ab52e)**
    - Update goes live October 7th, 2020
5. Never. Stop. Developing.

# Deployment

1. Clone the project (`git clone <project_url>`)
2. Install the latest Node.js and Node Project Manager (NPM) versions
3. Install the runtime dependencies (`npm install --production`)
4. Define the environment variables (see `example.env` for necessary variables)
5. Run the command `npm start`

Just invite the bot to the desired Discord server and the bot is fully operational.

# Development Instructions

## Cloning (for the first time)

- Please run `git clone --recursive <project url>` instead of the standard `git clone <project_url>`.
    - This is because DPS-kun relies on the Rhythm Game CSVs repository: https://github.com/Michael-A-Berger/Rhythm-Game-CSVs