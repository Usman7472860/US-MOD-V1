// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');

const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand, handleStatusMention } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const { tempbanCommand, untempbanCommand, restorePendingTempBans } = require('./commands/tempban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const { autoRevealViewOnce } = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');

const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');





const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { goodmorningCommand } = require('./commands/goodmorning');
const { goodafternoonCommand } = require('./commands/goodafternoon');
const { goodeveningCommand } = require('./commands/goodevening');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');

const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState, handleIncomingCall } = require('./commands/anticall');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const tiktokCommand = require('./commands/tiktok');
const facebookCommand = require('./commands/facebook');
const { ytmp3Command, ytmp4Command } = require('./commands/youtube');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');

// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A";
global.ytch = "Mr Unique Hacker";

// Add this near the top of main.js with other global configurations
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '@newsletter',
            newsletterName: 'M USMAN CHACHAR MD',
            serverMessageId: -1
        }
    }
};

// ─── OWNER PERSONAL MSG NOTIFIER ────────────────────────────────────────────
// Sends a private DM to owner whenever someone uses a command or sends a msg
async function notifyOwner(sock, senderJid, chatId, text, isGroup) {
    try {
        const ownerNumber = settings.owner; // e.g. "923001234567" from settings.js
        if (!ownerNumber) return;

        const ownerJid = ownerNumber.includes('@s.whatsapp.net')
            ? ownerNumber
            : `${ownerNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`;

        // Don't notify owner about their own messages
        if (senderJid === ownerJid || senderJid === `${ownerNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`) return;

        const senderNum = senderJid.replace('@s.whatsapp.net', '').replace('@lid', '');
        const location = isGroup ? `📢 *Group:* ${chatId.replace('@g.us', '')}` : `💬 *Private Chat*`;

        const notifMsg =
            `🔔 *New Message Alert!*\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `👤 *From:* @${senderNum}\n` +
            `${location}\n` +
            `💬 *Message:* ${text || '(media/no text)'}\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `_Usman Bot Notification_`;

        await sock.sendMessage(ownerJid, {
            text: notifMsg,
            mentions: [senderJid]
        });
    } catch (e) {
        // Silently fail — never crash main flow
    }
}
// ─────────────────────────────────────────────────────────────────────────────

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];


        if (!message?.message) return;

        // Handle autoread functionality
        await handleAutoread(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation (antidelete)
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        // ── Auto reveal view once messages & forward to owner ──────────────
        await autoRevealViewOnce(sock, message);

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            const chatId = message.key.remoteJid;

            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, {
                    text: '📢 *Join our Channel:*\nhttps://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A'
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('./commands/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, {
                    text: `🔗 *Support*\n\nhttps://chat.whatsapp.com/GA4WrOFythU6g3BFVubYM7?mode=wwt`
                }, { quoted: message });
                return;
            }
        }

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        // Read bot mode once; don't early-return so moderation can still run in private mode
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
            // default isPublic=true on error
        }
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        /*  // Basic message response in private chat
          if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'bot' || userMessage === 'hlo' || userMessage === 'hey' || userMessage === 'bro')) {
              await sock.sendMessage(chatId, {
                  text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.',
                  ...channelInfo
              });
              return;
          } */

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words and antilink FIRST, before ANY other processing
        // Always run moderation in groups, regardless of mode
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            // Antilink checks message text internally, so run it even if userMessage is empty
            await Antilink(message, sock);
        }

        // PM blocker: block non-owner DMs when enabled (do not ban)
        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    // Inform user, delay, then block without banning globally
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Then check for command prefix
        if (!userMessage.startsWith('.')) {
            // Show typing indicator if autotyping is enabled
            await handleAutotypingForMessage(sock, chatId, userMessage);

            // ─── SALAM AUTO REPLY ───────────────────────────────────────────
            const salamPhrases = [
                'salam', 'salaam', 'assalam', 'assalamu alaikum', 'assalamualaikum',
                'aoa', 'a.o.a', 'ao a', 'walaikum assalam', 'walaikum salam',
                'walikum salam', 'wslm', 'wsalam', 'w salam', 'slm',
                'salam u alaikum', 'salamualaikum', 'as salam', 'assalam o alaikum',
                'السلام عليكم', 'وعليكم السلام'
            ];
            const salamReplies = [
                'وعلیکم السلام 🙂',
                'وعلیکم السلام، ابھی تھوڑا busy ہوں، بتاؤ کیا کام ہے؟',
                'وعلیکم السلام 😊 کیسے ہو؟',
                'وعلیکم السلام! ہاں بھائی بولو',
                'وعلیکم السلام ورحمة اللہ 🤲',
                'وعلیکم السلام، سب ٹھیک؟',
                'وعلیکم السلام 👋 کیا حال ہے؟'
            ];
            const msgLower = userMessage.toLowerCase().trim();
            const isSalam = salamPhrases.some(phrase => 
                msgLower === phrase || 
                msgLower.startsWith(phrase + ' ') || 
                msgLower.startsWith(phrase + ',') ||
                msgLower.includes(phrase)
            );
            if (isSalam) {
                const reply = salamReplies[Math.floor(Math.random() * salamReplies.length)];
                await sock.sendMessage(chatId, { text: reply }, { quoted: message });
                return;
            }

            // ─── HOW ARE YOU / AP KESE HO AUTO REPLY ───────────────────────
            const howAreYouPhrases = [
                'how are you', 'how r u', 'how are u', 'hru', 'how r you',
                'how are you doing', 'how do you do', 'how is it going',
                'whats up', "what's up", 'wassup', 'sup',
                'ap kese hn', 'ap kaise hn', 'ap kese ho', 'ap kaise ho',
                'aap kese hain', 'aap kaise hain', 'aap kese ho', 'aap kaise ho',
                'kese ho', 'kaise ho', 'kese hn', 'kaise hn',
                'kya haal hai', 'kya hal hai', 'kya haal hy', 'kya hal hy',
                'kaisa chal raha hai', 'kaisa cal raha hai',
                'theek ho', 'theek hn', 'theak ho',
                'kiya haal hai', 'kia haal hai', 'kia hal hai',
                'sab theek', 'sab thik', 'sab khair',
                'kiya kar rahe ho', 'kia kar rahe ho', 'kiya ker rahe ho',
                'kiya kar rahe ho ajkal', 'kia kar rahe ho ajkal',
                'kiya ho raha hai', 'kia ho raha hai',
                'ajkal kiya chal raha', 'ajkal kia chal raha',
                'kya chal raha hai', 'kya cal raha hai',
                'life kaisi hai', 'life kaisi chal rahi',
                'sab theek thaak', 'sab thik thak',
                'kya scene hai', 'kya sc hai',
                'bata apna haal', 'sunao apna haal',
                'kahan ho', 'kaha ho', 'kahan hn'
            ];
            const howAreYouReplies = [
                'Alhamdulillah theek hun, aap sunao? 😊',
                'Theek hun yaar, kya scene hai? 😄',
                'Alhamdulillah! Aap ka kya haal hai?',
                'Bas theek, thoda busy tha. Bolo kya kaam hai 😊',
                'Mast chal raha hai sab, tum batao? 🙂',
                'Alhamdulillah zabardast! Aap bhi theek hon inshallah',
                'Theek hun, abhi free hua hun. Bolo 😄'
            ];
            const msgLower2 = userMessage.toLowerCase().trim();
            const isHowAreYou = howAreYouPhrases.some(phrase =>
                msgLower2 === phrase ||
                msgLower2.startsWith(phrase + ' ') ||
                msgLower2.startsWith(phrase + ',') ||
                msgLower2.startsWith(phrase + '?') ||
                msgLower2.includes(phrase)
            );
            if (isHowAreYou) {
                const reply = howAreYouReplies[Math.floor(Math.random() * howAreYouReplies.length)];
                await sock.sendMessage(chatId, { text: reply }, { quoted: message });
                return;
            }

            // ─── GREETINGS AUTO REPLY ───────────────────────────────────────
            const greetingPhrases = [
                'hi', 'hello', 'hey', 'helo', 'hii', 'hiii', 'hiiii',
                'good morning', 'gd morning', 'good mrng', 'gud morning', 'gd mrng',
                'good evening', 'gd evening', 'good night', 'gd night', 'goodnight',
                'good afternoon', 'gd afternoon',
                'subah bakhair', 'subah bakher', 'subha bakhair',
                'shab bakhair', 'shab bakher',
                'khuda hafiz', 'khuda hafez', 'allah hafiz', 'allah hafez',
                'bye', 'byee', 'byeee', 'goodbye', 'good bye', 'tata', 'tc',
                'take care', 'alvida', 'phir milenge', 'phir milte hain'
            ];
            const greetingReplies = {
                morning: [
                    'Subah bakhair! 😊 din acha guzre',
                    'Good morning! Aaj ka din mubarak ho ☀️',
                    'Subah bakhair, kya haal hai? 😄'
                ],
                evening: [
                    'Shaam bakhair 😊',
                    'Good evening! Din kaisa gaya? 😄'
                ],
                night: [
                    'Shab bakhair 🌙 meethi neend aaye',
                    'Good night! Allah ki hifazat mein raho 🤲',
                    'Shab bakhair, khwab achhe aayein 😊'
                ],
                bye: [
                    'Allah hafiz 😊',
                    'Khuda hafiz! phir milenge inshallah',
                    'Bye! take care 👋'
                ],
                hi: [
                    'Hello 😊 kya haal hai?',
                    'Hi! bolo kya kaam hai 😄',
                    'Haan bhai bolo 🙂',
                    'Hello! Kaisa chal raha hai? 😊',
                    'Ji bolo 😄'
                ]
            };
            const msgL = userMessage.toLowerCase().trim();
            let greetReply = null;
            if (['good morning','gd morning','good mrng','gud morning','gd mrng','goodmorning','gmorning','subah bakhair','subah bakher','subha bakhair','subah bkhr','sb','subha bkr'].some(p => msgL.includes(p))) {
                await goodmorningCommand(sock, chatId, message); return;
            } else if (['good afternoon','gd afternoon','goodafternoon','g afternoon','dopahar bakhair','dopahar bakher','dp bakhair','afternoon bhai','afternoon yaar'].some(p => msgL.includes(p))) {
                await goodafternoonCommand(sock, chatId, message); return;
            } else if (['good evening','gd evening','goodevening','g evening','shaam bakhair','shaam bakher','sham bakhair','evening bhai','evening yaar'].some(p => msgL.includes(p))) {
                await goodeveningCommand(sock, chatId, message); return;
            } else if (['good night','gd night','goodnight','gnight','g night','shab bakhair','shab bakher','shabb bakhair','gn bhai','gn yaar','gn bestie','gnight bhai','shab bkhr'].some(p => msgL.includes(p))) {
                await goodnightCommand(sock, chatId, message); return;
            } else if (['bye','byee','byeee','goodbye','good bye','tata','tc','take care','alvida','phir milenge','phir milte hain','khuda hafiz','khuda hafez','allah hafiz','allah hafez'].some(p => msgL === p || msgL.includes(p))) {
                greetReply = greetingReplies.bye[Math.floor(Math.random() * greetingReplies.bye.length)];
            } else if (['hi','hello','hey','helo','hii','hiii','hiiii','hlo','hellow','heyy','heyyy','hy','hye','hullo','holla','yo','sup','oye','oi','oii'].some(p => msgL === p)) {
                const salamReminder = [
                    'Bhai pehle salam karo 😄 hum salam karte hain yahan!',
                    'Arre yaar salam karo pehle! Hum Muslims hain 😊🤌',
                    'Hi nahi, Assalam u Alaikum bolo bhai 😄☪️',
                    'Bhai salam karo pehle, phir baat karte hain 😊',
                    'Oye! Salam ke baghair nahi chalega yahan 😄 AOA bolo!',
                    'Hum log salam se shuru karte hain bhai 🙂 try karo!',
                    'Salam seekho pehle, phir hi hello 😄☪️',
                    'Arre bhai AOA bolo pehle! Ye accha lagta hai 😊',
                    'Yahan salam ka culture hai bhai, AOA bolo 😄🤌',
                    'Salam karo bhai, phir baatein hogi 😊❤️'
                ];
                greetReply = salamReminder[Math.floor(Math.random() * salamReminder.length)];
            }
            if (greetReply) {
                await sock.sendMessage(chatId, { text: greetReply }, { quoted: message });
                return;
            }
            // ────────────────────────────────────────────────────────────────

            // ─── OK / DONE / COMING AUTO REPLY ─────────────────────────────
            const okPhrases = [
                // OK / Okay variants
                'ok', 'okay', 'okk', 'oky', 'okkk', 'okay then', 'ok ok',
                'oki', 'okie', 'okey', 'ok ji', 'okay ji', 'ok bhai', 'okay bhai',
                'theek hai', 'theak hai', 'thik hai', 'theek he', 'theek hy',
                'theek h', 'thik h', 'acha', 'accha', 'acha ji', 'accha ji',
                'acha bhai', 'accha bhai', 'acha theek hai', 'accha theek hai',
                'ji', 'ji ha', 'ji haan', 'ji han', 'jee', 'jee ha', 'jee haan',
                // Done variants
                'done', 'done ji', 'done bhai', 'ho gaya', 'hogaya', 'ho gia',
                'kar diya', 'kar dia', 'kiya', 'kia', 'ho gya', 'hogya',
                'mukammal', 'complete', 'completed', 'finish', 'finished',
                'ready', 'tayar', 'tayyar', 'tayaar',
                // Coming variants
                'coming', 'aa raha hun', 'aa raha hoon', 'aa rha hun', 'aa rha hoon',
                'araha hun', 'ara hun', 'ara hoon', 'aa rhi hun', 'aa rahi hun',
                'aata hun', 'aata hoon', 'ata hun', 'on my way', 'omw',
                'bus aa raha', 'bus araha', 'bas aa raha', 'thodi der mein',
                'pahunch raha', 'pahuncha', 'pahuncha hun', 'pohoncha hun',
                // Yes variants
                'yes', 'yess', 'yesss', 'yep', 'yup', 'yeah', 'yaa', 'yaar ha',
                'bilkul', 'bilkul ji', 'zaroor', 'zarur', 'haan', 'han', 'ha',
                'ha ji', 'haan ji', 'han ji', 'haan bhai', 'bilkul theek',
                'right', 'correct', 'sahi', 'sahi hai', 'sahi he',
                // Noted / Understood variants
                'noted', 'noted ji', 'noted bhai', 'samajh gaya', 'samajh gia',
                'samjh gaya', 'samajh liya', 'smjh gya', 'got it', 'got it bhai',
                'understood', 'clear', 'clear hai', 'clear he', 'copy that',
                // Fine / Alright variants
                'fine', 'fine ji', 'fine bhai', 'alright', 'alright bhai',
                'no problem', 'no prob', 'np', 'np ji', 'koi baat nahi',
                'koi bat nahi', 'koi masla nahi', 'no issue', 'all good',
                'sab theek', 'sab thik', 'sab ok', 'sab acha',
                // Sure / Agreed variants
                'sure', 'sure ji', 'sure bhai', 'ofcourse', 'of course',
                'agreed', 'agree', 'maan liya', 'man liya', 'mana liya',
                'deal', 'deal hai', 'pakka', 'pucca', 'pakka ji', 'pakka bhai',
                'confirm', 'confirmed', 'confirm hai', 'confirm he',
                // Waiting / Hold on variants
                'wait', 'wait karo', 'wait kar', 'ruko', 'ruk jao', 'ek second',
                'ek sec', '1 sec', '1 second', 'ek minute', '1 min', 'ek min',
                'hold on', 'just a moment', 'thoda wait', 'thodi der',
                'bas abhi', 'abhi aata', 'abhi ata', 'coming soon',
                // Received / Seen variants
                'received', 'dekh liya', 'dikh gaya', 'dekha', 'mila', 'mil gaya',
                'seen', 'read', 'padh liya', 'padh lia', 'mil gia',
                // Thanks / Welcome (short replies)
                'thanks', 'thank you', 'thankyou', 'ty', 'thnx', 'thx',
                'shukriya', 'meherbani', 'jazakallah', 'jzk', 'welcome',
                'no mention', 'mention not', 'its ok', "it\'s ok", 'koi baat na',
            ];
            const okReplies = [
                'ok',
            ];
            const msgLowerOk = userMessage.toLowerCase().trim();
            const isOkDoneComing = okPhrases.some(phrase =>
                msgLowerOk === phrase ||
                msgLowerOk === phrase + '.' ||
                msgLowerOk === phrase + '!' ||
                msgLowerOk === phrase + '?' ||
                msgLowerOk.startsWith(phrase + ' ') ||
                msgLowerOk.startsWith(phrase + ',')
            );
            if (isOkDoneComing) {
                const reply = okReplies[Math.floor(Math.random() * okReplies.length)];
                await sock.sendMessage(chatId, { text: reply }, { quoted: message });
                return;
            }
            // ────────────────────────────────────────────────────────────────

            // ─── AUTO SIM DATA DETECT ──────────────────────────────────
            const phoneRegex = /(?:^|\s)((?:\+92|0092|92|0)(?:3[0-9]{2})[\s-]?[0-9]{7})(?:\s|$)/;
            const phoneMatch = rawText.match(phoneRegex);
            if (phoneMatch) {
                const detectedNumber = phoneMatch[1].replace(/[\s-]/g, '');
                try {
                    await sock.sendMessage(chatId, {
                        text: `🔍 *Auto SIM Data*\nNumber detected: *${detectedNumber}*\nFetching data...`,
                        ...channelInfo
                    }, { quoted: message });
                    const apiUrl = `https://paksimdata.ftgmhacks.workers.dev/?number=${encodeURIComponent(detectedNumber)}`;
                    const simRes = await fetch(apiUrl);
                    if (simRes.ok) {
                        const result = await simRes.json();
                        const skipKeys = ['search_type', 'records_count', 'queried_number', 'input_query', 'data_source', 'success', 'credit', 'timestamp'];
                        const extractFields = (obj) => {
                            let lines = '';
                            for (const [k, v] of Object.entries(obj)) {
                                if (v === null || v === undefined || v === '') continue;
                                if (skipKeys.includes(k.toLowerCase())) continue;
                                if (typeof v === 'object') { lines += extractFields(v); }
                                else {
                                    const lbl = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                    lines += `🔹 *${lbl}:* ${v}\n`;
                                }
                            }
                            return lines;
                        };
                        const source = result?.data && typeof result.data === 'object' ? result.data : result;
                        const extracted = extractFields(source);
                        let replyText = `📋 *SIM Data Result*\n━━━━━━━━━━━━━━━━━━\n`;
                        replyText += `📱 *Number:* ${detectedNumber}\n`;
                        replyText += extracted.trim() || `⚠️ No record found for this number.`;
                        replyText += `\n━━━━━━━━━━━━━━━━━━\n_Powered by Usman Khan Chachar_`;
                        await sock.sendMessage(chatId, { text: replyText, ...channelInfo }, { quoted: message });
                    }
                } catch (e) {
                    console.error('[AutoSimData] Error:', e.message);
                }
                return;
            }
            // ────────────────────────────────────────────────────────────────

            // ─── AUTO VIDEO DOWNLOADER ────────────────────────────────────
            const tiktokRegex = /https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/[^\s]+/i;
            const facebookRegex = /https?:\/\/(www\.)?(facebook\.com|fb\.watch)\/[^\s]+/i;
            const youtubeRegex = /https?:\/\/(www\.)?(youtube\.com\/watch\?[^\s]*v=|youtu\.be\/)[^\s]+/i;

            if (tiktokRegex.test(rawText)) {
                const url = rawText.match(tiktokRegex)[0];
                try {
                    await tiktokCommand(sock, chatId, message, url);
                } catch (e) {
                    console.error('[AutoDL TikTok] Error:', e.message);
                }
                return;
            }

            if (facebookRegex.test(rawText)) {
                const url = rawText.match(facebookRegex)[0];
                try {
                    await facebookCommand(sock, chatId, message, url);
                } catch (e) {
                    console.error('[AutoDL Facebook] Error:', e.message);
                }
                return;
            }

            if (youtubeRegex.test(rawText)) {
                const url = rawText.match(youtubeRegex)[0];
                try {
                    await ytmp4Command(sock, chatId, message, url);
                } catch (e) {
                    console.error('[AutoDL YouTube] Error:', e.message);
                }
                return;
            }
            // ────────────────────────────────────────────────────────────────

            if (isGroup) {
                // Always run moderation features (antitag) regardless of mode
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);

                // Only run chatbot in public mode or for owner/sudo
                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        // In private mode, only owner/sudo can run commands
        if (!isPublic && !isOwnerOrSudoCheck) {
            return;
        }

        // List of admin commands
        const adminCommands = ['.mute', '.unmute', '.ban', '.unban', '.tempban', '.untempban', '.promote', '.demote', '.kick', '.tagall', '.tagnotadmin', '.hidetag', '.antilink', '.antitag', '.setgdesc', '.setgname', '.setgpp'];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact', '.autotyping', '.autoread', '.pmblocker'];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'Please make the bot an admin to use admin commands.', ...channelInfo }, { quoted: message });
                return;
            }

            if (
                userMessage.startsWith('.mute') ||
                userMessage === '.unmute' ||
                userMessage.startsWith('.ban') ||
                userMessage.startsWith('.unban') ||
                userMessage.startsWith('.promote') ||
                userMessage.startsWith('.demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'Sorry, only group admins can use this command.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' }, { quoted: message });
                return;
            }
        }

        // Command handlers - Execute commands immediately without waiting for typing indicator
        // We'll show typing indicator after command execution if needed
        let commandExecuted = false;

        switch (true) {
            case userMessage === '.simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the .simage command to convert it.', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }
            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case userMessage.startsWith('.mute'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use .mute with no number to mute immediately.', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith('.ban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .ban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.unban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .unban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tempban'):
                await tempbanCommand(sock, chatId, message, senderId, isSenderAdmin, isBotAdmin);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.untempban'):
                await untempbanCommand(sock, chatId, message, senderId, isSenderAdmin, isBotAdmin);
                commandExecuted = true;
                break;
            case userMessage === '.help' || userMessage === '.menu' || userMessage === '.bot' || userMessage === '.list':
                await helpCommand(sock, chatId, message, global.channelLink);
                commandExecuted = true;
                break;
            case userMessage === '.sticker' || userMessage === '.s':
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case userMessage.startsWith('.warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case userMessage.startsWith('.tts'):
                const text = userMessage.slice(4).trim();
                await ttsCommand(sock, chatId, text, message);
                break;
            case userMessage.startsWith('.delete') || userMessage.startsWith('.del'):
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case userMessage.startsWith('.attp'):
                await attpCommand(sock, chatId, message);
                break;

            case userMessage === '.settings':
                await settingsCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mode'):
                // Check if sender is the owner
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!', ...channelInfo }, { quoted: message });
                    return;
                }
                // Read current data first
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: 'Usage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                try {
                    // Update access mode
                    data.isPublic = action === 'public';

                    // Save updated data
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));

                    await sock.sendMessage(chatId, { text: `Bot is now in *${action}* mode`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.anticall'):
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use anticall.' }, { quoted: message });
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await anticallCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.pmblocker'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                break;
            case userMessage === '.tagall':
                await tagAllCommand(sock, chatId, senderId, message);
                break;
            case userMessage === '.tagnotadmin':
                await tagNotAdminCommand(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.hidetag'):
                {
                    const messageText = rawText.slice(8).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case userMessage.startsWith('.tag'):
                const messageText = rawText.slice(4).trim();  // use rawText here, not userMessage
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                break;
            case userMessage.startsWith('.antilink'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage.startsWith('.antitag'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage === '.meme':
                await memeCommand(sock, chatId, message);
                break;
            case userMessage === '.joke':
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === '.quote':
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === '.fact':
                await factCommand(sock, chatId, message, message);
                break;
            case userMessage.startsWith('.weather'):
                const city = userMessage.slice(9).trim();
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please specify a city, e.g., .weather London', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.news':
                await newsCommand(sock, chatId);
                break;
            case userMessage.startsWith('.ttt') || userMessage.startsWith('.tictactoe'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith('.move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo }, { quoted: message });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === '.topmembers':
                topMembers(sock, chatId, isGroup);
                break;
            case userMessage.startsWith('.hangman'):
                startHangman(sock, chatId);
                break;
            case userMessage.startsWith('.guess'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: 'Please guess a letter using .guess <letter>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.trivia'):
                startTrivia(sock, chatId);
                break;
            case userMessage.startsWith('.answer'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: 'Please provide an answer using .answer <answer>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.compliment'):
                await complimentCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.insult'):
                await insultCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.8ball'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case userMessage.startsWith('.lyrics'):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle, message);
                break;
            case userMessage.startsWith('.simp'):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;
            case userMessage.startsWith('.stupid') || userMessage.startsWith('.itssostupid') || userMessage.startsWith('.iss'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage === '.dare':
                await dareCommand(sock, chatId, message);
                break;
            case userMessage === '.truth':
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === '.clear':
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case userMessage.startsWith('.promote'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case userMessage.startsWith('.demote'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === '.ping':
                await pingCommand(sock, chatId, message);
                break;
            case userMessage === '.alive':
                await aliveCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mention '):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                break;
            case userMessage === '.setmention':
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                break;
            case userMessage.startsWith('.blur'):
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                break;
            case userMessage.startsWith('.welcome'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.goodbye'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.git':
            case userMessage === '.github':
            case userMessage === '.sc':
            case userMessage === '.script':
            case userMessage === '.repo':
                await githubCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.antibadword'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: '*Bot must be admin to use this feature*', ...channelInfo }, { quoted: message });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                break;
            case userMessage.startsWith('.chatbot'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo }, { quoted: message });
                    return;
                }

                const match = userMessage.slice(8).trim();
                await handleChatbotCommand(sock, chatId, message, match);
                break;
            case userMessage.startsWith('.take') || userMessage.startsWith('.steal'):
                {
                    const isSteal = userMessage.startsWith('.steal');
                    const sliceLen = isSteal ? 6 : 5; // '.steal' vs '.take'
                    const takeArgs = rawText.slice(sliceLen).trim().split(' ');
                    await takeCommand(sock, chatId, message, takeArgs);
                }
                break;
            case userMessage === '.flirt':
                await flirtCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.character'):
                await characterCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.waste'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === '.ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === '.groupinfo' || userMessage === '.infogp' || userMessage === '.infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === '.resetlink' || userMessage === '.revoke' || userMessage === '.anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === '.staff' || userMessage === '.admins' || userMessage === '.listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tourl') || userMessage.startsWith('.url'):
                await urlCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.emojimix') || userMessage.startsWith('.emix'):
                await emojimixCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tg') || userMessage.startsWith('.stickertelegram') || userMessage.startsWith('.tgsticker') || userMessage.startsWith('.telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === '.vv':
                await viewOnceCommand(sock, chatId, message);
                break;
            case userMessage === '.clearsession' || userMessage === '.clearsesi':
                await clearSessionCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autostatus'):
                const autoStatusArgs = userMessage.split(' ').slice(1);
                await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                break;
            case userMessage.startsWith('.simp'):
                await simpCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.metallic'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case userMessage.startsWith('.ice'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case userMessage.startsWith('.snow'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case userMessage.startsWith('.impressive'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case userMessage.startsWith('.matrix'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case userMessage.startsWith('.light'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case userMessage.startsWith('.neon'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case userMessage.startsWith('.devil'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case userMessage.startsWith('.purple'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case userMessage.startsWith('.thunder'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case userMessage.startsWith('.leaves'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case userMessage.startsWith('.1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case userMessage.startsWith('.arena'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case userMessage.startsWith('.hacker'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case userMessage.startsWith('.sand'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case userMessage.startsWith('.blackpink'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case userMessage.startsWith('.glitch'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case userMessage.startsWith('.fire'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case userMessage === '.surrender':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;
            case userMessage.startsWith('.antidelete'):
                const antideleteMatch = userMessage.slice(11).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === '.cleartmp':
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === '.setpp':
                await setProfilePicture(sock, chatId, message);
                break;
            case userMessage.startsWith('.setgdesc'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgname'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgpp'):
                await setGroupPhoto(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.instagram') || userMessage.startsWith('.insta') || (userMessage === '.ig' || userMessage.startsWith('.ig ')):
                await instagramCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.igsc'):
                await igsCommand(sock, chatId, message, true);
                break;
            case userMessage.startsWith('.igs'):
                await igsCommand(sock, chatId, message, false);
                break;
            case userMessage.startsWith('.tiktok') || userMessage.startsWith('.tt'):
                await tiktokCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.fb') || userMessage.startsWith('.facebook'):
                await facebookCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.ytmp3') || userMessage.startsWith('.mp3') || userMessage.startsWith('.song') || userMessage.startsWith('.play') || userMessage.startsWith('.music'):
                await ytmp3Command(sock, chatId, message);
                break;
            case userMessage.startsWith('.ytmp4') || userMessage.startsWith('.video') || userMessage.startsWith('.yt'):
                await ytmp4Command(sock, chatId, message);
                break;
            case userMessage.startsWith('.gpt') || userMessage.startsWith('.gemini'):
                await aiCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.translate') || userMessage.startsWith('.trt'):
                const commandLength = userMessage.startsWith('.translate') ? 10 : 4;
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;
            case userMessage.startsWith('.ss') || userMessage.startsWith('.ssweb') || userMessage.startsWith('.screenshot'):
                const ssCommandLength = userMessage.startsWith('.screenshot') ? 11 : (userMessage.startsWith('.ssweb') ? 6 : 3);
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;
            case userMessage.startsWith('.areact') || userMessage.startsWith('.autoreact') || userMessage.startsWith('.autoreaction'):
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudoCheck);
                break;
            case userMessage.startsWith('.sudo'):
                await sudoCommand(sock, chatId, message);
                break;
            case userMessage === '.goodnight' || userMessage === '.lovenight' || userMessage === '.gn':
                await goodnightCommand(sock, chatId, message);
                break;
            case userMessage === '.goodmorning' || userMessage === '.gm' || userMessage === '.subahbakhair':
                await goodmorningCommand(sock, chatId, message);
                break;
            case userMessage === '.goodafternoon' || userMessage === '.ga' || userMessage === '.dopaharbakhair':
                await goodafternoonCommand(sock, chatId, message);
                break;
            case userMessage === '.goodevening' || userMessage === '.ge' || userMessage === '.shaambakhair':
                await goodeveningCommand(sock, chatId, message);
                break;
            case userMessage === '.shayari' || userMessage === '.shayri':
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === '.roseday':
                await rosedayCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.imagine') || userMessage.startsWith('.flux') || userMessage.startsWith('.dalle'): await imagineCommand(sock, chatId, message);
                break;
            case userMessage === '.jid': await groupJidCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autotyping'):
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.autoread'):
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.heart'):
                await handleHeart(sock, chatId, message);
                break;
            case userMessage.startsWith('.horny'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['horny', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.circle'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['circle', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lgbt'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lgbt', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lolice'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lolice', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.simpcard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['simpcard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tonikawa'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tonikawa', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.its-so-stupid'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['its-so-stupid', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.namecard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['namecard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith('.oogway2'):
            case userMessage.startsWith('.oogway'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith('.oogway2') ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tweet'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tweet', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytcomment'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['youtube-comment', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.comrade'):
            case userMessage.startsWith('.gay'):
            case userMessage.startsWith('.glass'):
            case userMessage.startsWith('.jail'):
            case userMessage.startsWith('.passed'):
            case userMessage.startsWith('.triggered'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.slice(1).split(/\s+/)[0];
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.animu'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                break;
            // animu aliases
            case userMessage.startsWith('.nom'):
            case userMessage.startsWith('.poke'):
            case userMessage.startsWith('.cry'):
            case userMessage.startsWith('.kiss'):
            case userMessage.startsWith('.pat'):
            case userMessage.startsWith('.hug'):
            case userMessage.startsWith('.wink'):
            case userMessage.startsWith('.facepalm'):
            case userMessage.startsWith('.face-palm'):
            case userMessage.startsWith('.animuquote'):
            case userMessage.startsWith('.quote'):
            case userMessage.startsWith('.loli'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = parts[0].slice(1);
                    if (sub === 'facepalm') sub = 'face-palm';
                    if (sub === 'quote' || sub === 'animuquote') sub = 'quote';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                break;
            case userMessage === '.crop':
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.pies'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandExecuted = true;
                }
                break;
            case userMessage === '.china':
                await piesAlias(sock, chatId, message, 'china');
                commandExecuted = true;
                break;
            case userMessage === '.indonesia':
                await piesAlias(sock, chatId, message, 'indonesia');
                commandExecuted = true;
                break;
            case userMessage === '.japan':
                await piesAlias(sock, chatId, message, 'japan');
                commandExecuted = true;
                break;
            case userMessage === '.korea':
                await piesAlias(sock, chatId, message, 'korea');
                commandExecuted = true;
                break;
            case userMessage === '.india':
                await piesAlias(sock, chatId, message, 'india');
                commandExecuted = true;
                break;
            case userMessage === '.malaysia':
                await piesAlias(sock, chatId, message, 'malaysia');
                commandExecuted = true;
                break;
            case userMessage === '.thailand':
                await piesAlias(sock, chatId, message, 'thailand');
                commandExecuted = true;
                break;
            case userMessage.startsWith('.update'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, zipArg);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.removebg') || userMessage.startsWith('.rmbg') || userMessage.startsWith('.nobg'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.remini') || userMessage.startsWith('.enhance') || userMessage.startsWith('.upscale'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.sora'):
                await soraCommand(sock, chatId, message);
                break;

            // ─── SIM DATA COMMAND ───────────────────────────────────────────
            case userMessage.startsWith('.simdata'):
            case userMessage.startsWith('.sim'): {
                const parts = rawText.trim().split(/\s+/);
                const number = parts[1];

                if (!number) {
                    await sock.sendMessage(chatId, {
                        text: '❌ *SIM Data Check*\n\nPlease provide a phone number.\n\n📌 *Usage:* .simdata <number>\n📌 *Example:* .simdata 03001234567',
                        ...channelInfo
                    }, { quoted: message });
                    commandExecuted = true;
                    break;
                }

                try {
                    await sock.sendMessage(chatId, {
                        text: `🔍 Checking SIM data for *${number}*... Please wait.`,
                        ...channelInfo
                    }, { quoted: message });

                    const apiUrl = `https://paksimdata.ftgmhacks.workers.dev/?number=${encodeURIComponent(number)}`;
                    const response = await fetch(apiUrl);

                    if (!response.ok) {
                        throw new Error(`API returned status ${response.status}`);
                    }

                    const result = await response.json();

                    // API returns: { success, data: { ...info }, credit, timestamp }
                    let replyText = `📋 *SIM Data Result*\n`;
                    replyText += `━━━━━━━━━━━━━━━━━━\n`;
                    replyText += `📱 *Number:* ${number}\n`;

                    // Keys to skip completely
                    const skipKeys = ['search_type', 'records_count', 'queried_number', 'input_query', 'data_source', 'success', 'credit', 'timestamp'];

                    // Flatten any object: extract only string/number leaf values
                    const extractFields = (obj) => {
                        let lines = '';
                        for (const [k, v] of Object.entries(obj)) {
                            if (v === null || v === undefined || v === '') continue;
                            if (skipKeys.includes(k.toLowerCase())) continue;
                            if (typeof v === 'object') {
                                // Go one level deeper
                                lines += extractFields(v);
                            } else {
                                const lbl = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                lines += `🔹 *${lbl}:* ${v}\n`;
                            }
                        }
                        return lines;
                    };

                    // Support both: result.data.0 and result.0 structures
                    const source = (result && typeof result === 'object')
                        ? (result.data && typeof result.data === 'object' ? result.data : result)
                        : null;

                    if (source) {
                        const extracted = extractFields(source);
                        if (extracted.trim()) {
                            replyText += extracted;
                        } else {
                            replyText += `⚠️ *No record found for this number.*\n`;
                        }
                    } else {
                        replyText += `⚠️ No data found for this number.\n`;
                    }

                    replyText += `━━━━━━━━━━━━━━━━━━\n`;
                    replyText += `_Powered by Usman Khan Chachar_`;

                    await sock.sendMessage(chatId, {
                        text: replyText,
                        ...channelInfo
                    }, { quoted: message });

                } catch (err) {
                    console.error('SimData error:', err.message);
                    await sock.sendMessage(chatId, {
                        text: `❌ *Error fetching SIM data*\n\nCould not retrieve data for *${number}*.\n\nPossible reasons:\n• Number not found in database\n• API temporarily unavailable\n• Invalid number format\n\nPlease try again later.`,
                        ...channelInfo
                    }, { quoted: message });
                }

                commandExecuted = true;
                break;
            }
            // ────────────────────────────────────────────────────────────────

            default:
                if (isGroup) {
                    // Handle non-command group messages
                    if (userMessage) {  // Make sure there's a message
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await handleTagDetection(sock, chatId, message, senderId);
                    await handleMentionDetection(sock, chatId, message);
                }
                commandExecuted = false;
                break;
        }

        // If a command was executed, show typing status after command execution
        if (commandExecuted !== false) {
            // Command was executed, now show typing status after command execution
            await showTypingAfterCommand(sock, chatId);
        }

        // Function to handle .groupjid command
        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, {
                    text: "❌ This command can only be used in a group."
                });
            }

            await sock.sendMessage(chatId, {
                text: `✅ Group JID: ${groupJid}`
            }, {
                quoted: message
            });
        }

        if (userMessage.startsWith('.')) {
            // After command is processed successfully
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        // Only try to send error message if we have a valid chatId
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: '❌ Failed to process command!',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Respect bot mode: only announce promote/demote in public mode
        let isPublic = true;
        try {
            const modeData = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
        } catch (e) {
            // If reading fails, default to public behavior
        }

        // Handle promotion events
        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        // Handle leave events
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleIncomingCall,
    handleMessages,
    handleGroupParticipantUpdate,
    restorePendingTempBans,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
        await handleStatusMention(sock, status);
    }
};