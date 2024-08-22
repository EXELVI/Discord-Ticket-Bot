# 🎟️ Discord Ticket Bot

![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PNPM](https://img.shields.io/badge/PNPM-CF51E1?style=for-the-badge&logo=pnpm&logoColor=white)

Welcome to the **Discord Ticket Bot** repository! This bot is designed to manage support tickets within a Discord server, allowing staff members to effectively handle user requests with a variety of commands and automated actions.

## ✨ Features 

- **Ticket Creation**: Users can open support tickets with a single click, choosing the appropriate category.
- **Ticket Claiming**: Staff members can claim tickets to indicate that they are handling the request. 
- **Ticket Closure**: Staff members can close tickets with a reason, rating the user's experience.
- **Transcripts**: All ticket conversations are logged and stored as HTML files for future reference.
- **Web Interface**: Users can view ongoing tickets and their status through a web interface.
- **Leaderboard**: Track the performance of staff members based on user reviews, providing a feedback to the staff.
- **Review System**: Users can rate their experience after a ticket is closed.

## 🚀 Getting Started

To get started with the Discord Ticket Bot, follow the steps below: 

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/Discord-Ticket-Bot.git
    cd Discord-Ticket-Bot
    ```

2. **Install the dependencies**:

    If you use [pnpm](https://pnpm.io/), run the following command:
    ```bash
    pnpm install
    ```

    else:
    ```bash
    npm install
    ```

3. **Configure the environment**:
    
    - Create a `.env` file in the root directory.
    - Add the following environment variables to the `.env` file:
        ```env
        token=your_bot_token
        mongodb=your_mongodb_uri
        ```

4. **Run the bot**:

     ```bash
     node index.js
     ```   


## 📝 Commands

The Discord Ticket Bot includes a variety of commands to manage tickets, here are some of the key commands available:

| Command | Description | Arguments | Example |
|---------|-------------|-----------|---------|
| `/claim` | Claim a ticket to indicate that you are handling the request. | `none` | `/claim` |
| `/close` | Close a ticket with a reason and rating. | `reason` | `/close Resolved` |
| `/leaderboard` | Review the leaderboard for staff members based on user ratings. | `none` | `/leaderboard` |
| `/tinfo` | View information about a ticket, including the user and staff member assigned. | `none` | `/tinfo` |
| `/unclaim` | Unclaim a ticket to indicate that you are no longer handling the request. | `none` | `/unclaim` |

## 📚 Events

The Discord Ticket Bot includes a variety of events, here are some of the key events available:

| Event | Description |
|-------|-------------|
| `ready` | Bot ready event, registers all commands. |
| `delete` | Handles ticket deletion, logs, transcript. |
| `feedstars` | Handles rating system after ticket closure. |
| `messageCreate` | Auto-claims ticket when staff member sends a message. |
| `reopen` | Reopens a ticket upon button press. |
| `rreopen` | Processes user requests to reopen a ticket. |
| `selectMenu` | Handles ticket category selection. |
| `ticket` | Handles ticket creation upon button press. |

## 🖥️ Web Interface

The Discord Ticket Bot includes a web interface to view ongoing tickets and their status. The web interface is built using EJS templates and is served through an Express server.

To access the web interface, navigate to `https://localhost:3000/ticket/[server_id]/[ticket_id]` in your browser, replacing `[server_id]` and `[ticket_id]` with the appropriate values.

> If the ticket is deleted, it will show directly the transcript of the ticket.

## 📂 Project Structure

```bash
/
│   .env                        # Contains token and MongoDB credentials (excluded from git)
│   .gitattributes
│   .gitignore
│   bot.js                      # Handles the bot's shard
│   client.js                   # Bot client setup (required in bot.js)
│   db.js                       # Database connection setup
│   index.js                    # Shard manager and express server for transcripts
│   localhost.crt               # SSL certificate (excluded from git)
│   localhost.key               # SSL key (excluded from git)
│   manager.js                  # Shard manager setup (required in index.js)
│   package.json
│   pnpm-lock.yaml
│   README.md                   # This file
│
├───commands                    # Commands directory
│   └───ticket
│           claim.js            # Claim a ticket command
│           close.js            # Close a ticket with a reason and interaction options
│           leaderboard.js      # Review leaderboard for staff members
│           tinfo.js            # Ticket information command
│           unclaim.js          # Unclaim a ticket command
│
├───events                      # Events directory
│   ├───general
│   │       ready.js            # Bot ready event, registers all commands
│   │
│   └───tickets
│           delete.js           # Handles ticket deletion, logs transcript
│           feedstars.js        # Handles rating system after ticket closure
│           messageCreate.js    # Auto-claims ticket when staff member sends a message
│           reopen.js           # Reopens a ticket upon button press
│           rreopen.js          # Processes user requests to reopen a ticket
│           selectMenu.js       # Handles ticket category selection
│           ticket.js           # Handles ticket creation upon button press
│
├───public                      # Public assets (e.g., images, styles)
├───transcripts                 # Transcript storage (excluded from git)
│   └───[server_id]
│           [transcript_id].html # Generated transcripts for each ticket
│
└───views                       # EJS templates for web interface
        error.ejs               # Error page
        ticket.ejs              # Ongoing ticket page

```

## 🤝 Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss potential changes.
