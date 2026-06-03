const { setAntitag, getAntitag, removeAntitag } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');

async function handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message) {
    try {
        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { text: '```For Group Admins Only!```' },{quoted :message});
            return;
        }

        const prefix = '.';
        const args = userMessage.slice(9).toLowerCase().trim().split(' ');
        const action = args[0];

        if (!action) {
            const usage = `\`\`\`ANTITAG SETUP\n\n${prefix}antitag on\n${prefix}antitag set delete | kick\n${prefix}antitag off\n\`\`\``;
            await sock.sendMessage(chatId, { text: usage },{quoted :message});
            return;
        }

        switch (action) {
            case 'on':
                const existingConfig = await getAntitag(chatId, 'on');
                if (existingConfig?.enabled) {
                    await sock.sendMessage(chatId, { text: '*_Antitag is already on_*' },{quoted :message});
                    return;
                }
                const result = await setAntitag(chatId, 'on', 'delete');
                await sock.sendMessage(chatId, { 
                    text: result ? '*_Antitag has been turned ON_*' : '*_Failed to turn on Antitag_*' 
                },{quoted :message});
                break;

            case 'off':
                await removeAntitag(chatId, 'on');
                await sock.sendMessage(chatId, { text: '*_Antitag has been turned OFF_*' },{quoted :message});
                break;

            case 'set':
                if (args.length < 2) {
                    await sock.sendMessage(chatId, { 
                        text: `*_Please specify an action: ${prefix}antitag set delete | kick_*` 
                    },{quoted :message});
                    return;
                }
                const setAction = args[1];
                if (!['delete', 'kick'].includes(setAction)) {
                    await sock.sendMessage(chatId, { 
                        text: '*_Invalid action. Choose delete or kick._*' 
                    },{quoted :message});
                    return;
                }
                const setResult = await setAntitag(chatId, 'on', setAction);
                await sock.sendMessage(chatId, { 
                    text: setResult ? `*_Antitag action set to ${setAction}_*` : '*_Failed to set Antitag action_*' 
                },{quoted :message});
                break;

            case 'get':
                const status = await getAntitag(chatId, 'on');
                const actionConfig = await getAntitag(chatId, 'on');
                await sock.sendMessage(chatId, { 
                    text: `*_Antitag Configuration:_*\nStatus: ${status ? 'ON' : 'OFF'}\nAction: ${actionConfig ? actionConfig.action : 'Not set'}` 
                },{quoted :message});
                break;

            default:
                await sock.sendMessage(chatId, { text: `*_Use ${prefix}antitag for usage._*` },{quoted :message});
        }
    } catch (error) {
        console.error('Error in antitag command:', error);
        await sock.sendMessage(chatId, { text: '*_Error processing antitag command_*' },{quoted :message});
    }
}

const fs = require('fs');
const path = require('path');
const tagWarnPath = path.join(__dirname, '..', 'data', 'tagwarnings.json');

function loadTagWarnings() {
    try {
        return JSON.parse(fs.readFileSync(tagWarnPath, 'utf8'));
    } catch {
        return {};
    }
}

function saveTagWarnings(data) {
    fs.writeFileSync(tagWarnPath, JSON.stringify(data, null, 2));
}

function getTagWarnCount(chatId, senderId) {
    const data = loadTagWarnings();
    return data[chatId]?.[senderId] || 0;
}

function incrementTagWarn(chatId, senderId) {
    const data = loadTagWarnings();
    if (!data[chatId]) data[chatId] = {};
    data[chatId][senderId] = (data[chatId][senderId] || 0) + 1;
    saveTagWarnings(data);
    return data[chatId][senderId];
}

function resetTagWarn(chatId, senderId) {
    const data = loadTagWarnings();
    if (data[chatId]) delete data[chatId][senderId];
    saveTagWarnings(data);
}

async function handleTagDetection(sock, chatId, message, senderId) {
    try {
        const antitagSetting = await getAntitag(chatId, 'on');
        if (!antitagSetting || !antitagSetting.enabled) return;

        // Skip if sender is admin
        const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
        if (isSenderAdmin) return;

        // Get mentioned JIDs from all message types
        const mentionedJids = (
            message.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
            message.message?.imageMessage?.contextInfo?.mentionedJid ||
            message.message?.videoMessage?.contextInfo?.mentionedJid ||
            message.message?.stickerMessage?.contextInfo?.mentionedJid || []
        );

        // Extract text from all possible message types
        const messageText = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption || ''
        );

        // Detect numeric-style tagall (bot tagall pattern like @2193847561234)
        const numericMentions = messageText.match(/@\d{10,}/g) || [];
        const uniqueNumericMentions = new Set();
        numericMentions.forEach(m => {
            const n = m.match(/@(\d+)/);
            if (n) uniqueNumericMentions.add(n[1]);
        });

        const totalMentions = Math.max(mentionedJids.length, uniqueNumericMentions.size);
        if (totalMentions < 1) return;

        // ── Check if this is a TAGALL (mentioning large portion of group) ──
        let isTagAll = false;
        try {
            const groupMetadata = await sock.groupMetadata(chatId);
            const totalMembers = groupMetadata.participants?.length || 0;
            // If mentions >= 30% of members OR >= 5 members mentioned → tagall
            if (totalMembers > 0 && (totalMentions >= Math.ceil(totalMembers * 0.3) || totalMentions >= 5)) {
                isTagAll = true;
            }
        } catch (e) {}

        const action = antitagSetting.action || 'delete';
        const senderNum = `@${senderId.split('@')[0]}`;

        // Always delete the message first
        try {
            await sock.sendMessage(chatId, {
                delete: {
                    remoteJid: chatId,
                    fromMe: false,
                    id: message.key.id,
                    participant: senderId
                }
            });
        } catch (e) {}

        const imgPath = path.join(__dirname, '..', 'assets', 'sticktag.webp');
        const imgExists = fs.existsSync(imgPath);

        // ── 3-warning system for ALL tag types (single, few, or tagall) ──
        const warnCount = incrementTagWarn(chatId, senderId);
        const tagType = isTagAll ? '🚨 *Tagall Detected!*' : '⚠️ *Tag Detected!*';

        if (warnCount < 3) {
            // Warning 1 or 2
            if (imgExists) {
                await sock.sendMessage(chatId, {
                    image: fs.readFileSync(imgPath),
                    caption: `${tagType}\n\n${senderNum} *tag mat kar!*\n\n🔴 Warning *${warnCount}/3*\nTeen warnings ke baad kick ho jaoge! ❌`,
                    mentions: [senderId]
                });
            } else {
                await sock.sendMessage(chatId, {
                    text: `${tagType}\n\n${senderNum} *tag mat kar!*\n\n🔴 Warning *${warnCount}/3*\nTeen warnings ke baad kick ho jaoge! ❌`,
                    mentions: [senderId]
                });
            }
        } else {
            // 3rd warning → final action
            resetTagWarn(chatId, senderId);
            if (action === 'kick') {
                try { await sock.groupParticipantsUpdate(chatId, [senderId], 'remove'); } catch (e) {}
                await sock.sendMessage(chatId, {
                    text: `🚫 ${senderNum} ko *3 warnings* ke baad *kick* kar diya gaya!\nTag karna mana hai is group mein. ❌`,
                    mentions: [senderId]
                });
            } else {
                await sock.sendMessage(chatId, {
                    text: `🚫 ${senderNum} *3 warnings* poori ho gayi!\nAb se tag bilkul mat karna! ❌`,
                    mentions: [senderId]
                });
            }
        }
    } catch (error) {
        console.error('Error in tag detection:', error);
    }
}

module.exports = {
    handleAntitagCommand,
    handleTagDetection
};

