<div align="center">

<img src="https://raw.githubusercontent.com/ProBoy315/us-mod-bot/main/assets/bot_image.jpg" width="200" height="200" style="border-radius:50%;" alt="US MOD BOT"/>

# 🤖 US MOD BOT
### *Advanced WhatsApp Group Management Bot*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-v7-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Made By](https://img.shields.io/badge/Made%20By-M%20Usman%20Chachar-ff6b6b?style=for-the-badge)](https://github.com/ProBoy315)

</div>

---

## ✨ Features Overview

| Category | Features |
|---|---|
| 🛡️ **Group Safety** | Anti-tag, Anti-link, Anti-badword, Anti-call, Anti-delete |
| 👮 **Admin Tools** | Ban, Kick, Mute, Promote, Demote, Warn, Temp-ban |
| 📥 **Downloader** | TikTok, YouTube, Instagram, Facebook, Anime |
| 🎨 **Sticker** | Sticker, Sticker Crop, Sticker Alt, ATTP, Sticker Telegram |
| 🤖 **AI & Chat** | AI Chatbot, Imagine (AI Image), Remini, Remove BG |
| 🎮 **Games** | Tic-Tac-Toe, Hangman, 8Ball, Truth, Dare, Ship, Trivia |
| 📢 **Auto Features** | Auto Status, Auto Read, Auto Typing, Auto Reactions |
| 🌐 **Info Tools** | Weather, News, Lyrics, Translate, GitHub, URL info |
| 💬 **Fun** | Jokes, Memes, Quotes, Flirt, Insult, Compliment, Shayari |
| ⚙️ **Utility** | Ping, Alive, Tag All, Hide Tag, View Once, Screenshot |

---

## 📋 All Commands

### 🛡️ Anti-Spam & Safety
| Command | Description |
|---|---|
| `.antitag on/off` | Tag karna band karo — 3 warnings ke baad kick |
| `.antilink on/off` | Group links block karo |
| `.antibadword on/off` | Gandi zuban block karo |
| `.anticall on/off` | Group calls block karo |
| `.antidelete on/off` | Delete hone wale messages recover karo |

### 👮 Group Management
| Command | Description |
|---|---|
| `.ban @user` | User ko ban karo |
| `.unban @user` | User ka ban hatao |
| `.kick @user` | User ko group se nikalo |
| `.mute` | Group mute karo (sirf admins baat kar sakte hain) |
| `.unmute` | Group unmute karo |
| `.promote @user` | User ko admin banao |
| `.demote @user` | Admin ko member banao |
| `.warn @user` | User ko warning do |
| `.warnings @user` | User ki warnings dekho |
| `.tempban @user 10m` | User ko 10 minute ke liye ban karo |
| `.tagall` | Sab members ko tag karo (sirf admin) |
| `.tagnotadmin` | Non-admin members ko tag karo |
| `.hidetag [text]` | Sabko silently tag karo |

### 📥 Downloaders
| Command | Description |
|---|---|
| `.tiktok [url]` | TikTok video + audio download karo |
| `.youtube [url]` | YouTube video download karo |
| `.instagram [url]` | Instagram reel/post download karo |
| `.facebook [url]` | Facebook video download karo |
| `.anime [name]` | Anime search karo |

### 🎨 Sticker Tools
| Command | Description |
|---|---|
| `.sticker` | Image/video se sticker banao |
| `.stickercrop` | Sticker crop karo |
| `.attp [text]` | Text se animated sticker banao |
| `.take [name]` | Sticker ka naam/author set karo |

### 🤖 AI Tools
| Command | Description |
|---|---|
| `.ai [text]` | AI se baat karo |
| `.imagine [text]` | AI se image banao |
| `.remini` | Photo quality improve karo |
| `.removebg` | Photo ka background hatao |
| `.chatbot on/off` | Auto AI chatbot on/off karo |
| `.translate [lang] [text]` | Kisi bhi zuban mein translate karo |
| `.tts [text]` | Text ko voice mein convert karo |

### 🎮 Games & Fun
| Command | Description |
|---|---|
| `.tictactoe @user` | Tic Tac Toe khelao |
| `.hangman` | Hangman game |
| `.8ball [question]` | Magic 8 ball se pocho |
| `.truth` | Truth question |
| `.dare` | Dare challenge |
| `.ship @user1 @user2` | Love percentage dekho |
| `.trivia` | Trivia question |
| `.joke` | Joke suno |
| `.meme` | Random meme |
| `.quote` | Motivational quote |
| `.flirt` | Flirt message |
| `.shayari` | Urdu shayari |

### 📢 Auto Features
| Command | Description |
|---|---|
| `.autostatus on/off` | Status auto-view on/off |
| `.autoread on/off` | Messages auto-read on/off |
| `.autotyping on/off` | Typing indicator on/off |
| `.welcome on/off` | Welcome message on/off |
| `.goodbye on/off` | Goodbye message on/off |

### ⚙️ Utility
| Command | Description |
|---|---|
| `.ping` | Bot ki speed check karo |
| `.alive` | Bot online hai ya nahi |
| `.groupinfo` | Group ki info dekho |
| `.topmembers` | Top active members |
| `.viewonce` | View once message dekho |
| `.ss [url]` | Website ka screenshot lo |
| `.weather [city]` | Mausam ki khabar |
| `.news` | Latest khabrain |
| `.lyrics [song]` | Song ke lyrics |
| `.github [username]` | GitHub profile info |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js **v18+**
- Git

### Install karo

```bash
git clone https://github.com/ProBoy315/us-mod-bot
cd us-mod-bot
npm install
node index.js
```

### Pair Code se connect karo

```bash
node index.js
# Apna number enter karo
# WhatsApp > Linked Devices > Pair with phone number
```

---

## ⚙️ Settings

`settings.js` file mein apni settings karo:

```js
module.exports = {
    ownerNumber: '923xxxxxxxxx',  // Apna number
    botName: 'US MOD BOT',
    prefix: '.',
}
```

---

## 📞 Contact & Support

| | |
|---|---|
| 👤 **Developer** | Muhammad Usman Chachar |
| 💬 **WhatsApp** | [+92 320 4822390](https://wa.me/923204822390) |
| 📱 **TikTok** | [@itx_proboy](https://tiktok.com/@itx_proboy) |
| 📸 **Instagram** | [@itx___proboy](https://instagram.com/itx___proboy) |
| 💻 **GitHub** | [ProBoy315](https://github.com/ProBoy315) |
| ✈️ **Telegram** | [@itx_proboy](https://t.me/itx_proboy) |
| 📘 **Facebook** | [Profile](https://www.facebook.com/profile.php?id=100093176537267) |

---

## ⚠️ Important Note

> Ye bot sirf **educational purpose** ke liye hai. WhatsApp ke Terms of Service ke against use karne par account ban ho sakta hai. **Apni zimmedari par use karo.**

---

<div align="center">

*Made with ❤️ by* **Muhammad Usman Chachar (US MODS MD)** *© 2025*

</div>
