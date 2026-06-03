const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const settings = require('../settings');

// ─── Config ───────────────────────────────────────────────────────────────────
const CONFIG = {
    REVEAL_IN_SAME_CHAT: false,   // Same chat mein nahi bhejega
    FORWARD_TO_OWNER: true,       // Owner ko forward karega
    REVEAL_OWN_MESSAGES: false,   // Apne messages skip karo
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
};

// ─── Helper: Download with Retry ─────────────────────────────────────────────
async function downloadWithRetry(mediaMsg, type, retries = CONFIG.MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const stream = await downloadContentFromMessage(mediaMsg, type);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            if (buffer.length === 0) throw new Error('Empty buffer received');
            return buffer;
        } catch (err) {
            console.warn(`[ViewOnce] Download attempt ${attempt}/${retries} failed: ${err.message}`);
            if (attempt < retries) await new Promise(r => setTimeout(r, CONFIG.RETRY_DELAY * attempt));
            else throw err;
        }
    }
}

// ─── Helper: Extract ViewOnce Message ────────────────────────────────────────
function extractViewOnceMsg(msgContent) {
    return (
        msgContent?.viewOnceMessage?.message ||
        msgContent?.viewOnceMessageV2?.message ||
        msgContent?.viewOnceMessageV2Extension?.message ||
        null
    );
}

// ─── Helper: Extract Quoted ViewOnce ─────────────────────────────────────────
function extractQuotedViewOnce(message) {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return { qVO: null, quoted: null };

    const qVO =
        quoted?.viewOnceMessage?.message ||
        quoted?.viewOnceMessageV2?.message ||
        quoted?.viewOnceMessageV2Extension?.message ||
        null;

    return { qVO, quoted };
}

// ─── Helper: Send Media ───────────────────────────────────────────────────────
async function sendMedia(sock, jid, mediaType, buffer, caption, mimetype, ptt, quotedMsg) {
    const opts = quotedMsg ? { quoted: quotedMsg } : {};

    if (mediaType === 'image') {
        await sock.sendMessage(jid, { image: buffer, caption }, opts);
    } else if (mediaType === 'video') {
        await sock.sendMessage(jid, { video: buffer, caption }, opts);
    } else if (mediaType === 'audio') {
        await sock.sendMessage(jid, {
            audio: buffer,
            mimetype: mimetype || 'audio/mpeg',
            ptt: ptt || false
        }, opts);
    }
}

// ─── Manual .vv Command ───────────────────────────────────────────────────────
async function viewonceCommand(sock, chatId, message) {
    const { qVO, quoted } = extractQuotedViewOnce(message);

    const quotedImage = qVO?.imageMessage || quoted?.imageMessage;
    const quotedVideo = qVO?.videoMessage || quoted?.videoMessage;
    const quotedAudio = qVO?.audioMessage || quoted?.audioMessage;

    let mediaMsg = null, mediaType = null, mimetype = '', ptt = false, caption = '';

    if (quotedImage) {
        mediaMsg = quotedImage; mediaType = 'image'; caption = quotedImage.caption || '';
    } else if (quotedVideo) {
        mediaMsg = quotedVideo; mediaType = 'video'; caption = quotedVideo.caption || '';
    } else if (quotedAudio) {
        mediaMsg = quotedAudio; mediaType = 'audio';
        mimetype = quotedAudio.mimetype || 'audio/mpeg';
        ptt = quotedAudio.ptt || false;
    } else {
        return sock.sendMessage(chatId, {
            text: '❌ Kisi view-once image, video, ya audio ko reply karo.'
        }, { quoted: message });
    }

    try {
        const buffer = await downloadWithRetry(mediaMsg, mediaType);

        const sender    = message.key.participant || message.key.remoteJid;
        const senderNum = sender.split('@')[0];
        const ownerJid  = settings.ownerNumber + '@s.whatsapp.net';

        // Owner ko media bhejo
        const ownerCaption = mediaType !== 'audio'
            ? `👁️ *View Once ${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}*\n👤 *Sender:* @${senderNum}\n📌 *Chat:* ${chatId}\n${caption ? `📝 ${caption}` : ''}`
            : '';

        await sendMedia(sock, ownerJid, mediaType, buffer, ownerCaption, mimetype, ptt, null);

        if (mediaType === 'audio') {
            await sock.sendMessage(ownerJid, {
                text: `👁️ *View Once Audio*\n👤 *Sender:* @${senderNum}\n📌 *Chat:* ${chatId}\n${ptt ? '🎤 Voice Note' : '🎵 Audio'}`
            });
        }

        // User ka .vv message delete karo (5 sec baad)
        setTimeout(async () => {
            try { await sock.sendMessage(chatId, { delete: message.key }); } catch (_) {}
        }, 5000);

    } catch (e) {
        // Silently fail
    }
}

// ─── Auto ViewOnce Reveal ─────────────────────────────────────────────────────
async function autoRevealViewOnce(sock, message) {
    try {
        const msgContent = message.message;
        if (!msgContent) return;

        const viewOnceMsg = extractViewOnceMsg(msgContent);
        if (!viewOnceMsg) return;

        if (message.key.fromMe && !CONFIG.REVEAL_OWN_MESSAGES) return;

        const chatId    = message.key.remoteJid;
        const sender    = message.key.participant || message.key.remoteJid;
        const senderNum = sender.split('@')[0];
        const ownerJid  = settings.ownerNumber + '@s.whatsapp.net';
        const isGroup   = chatId.endsWith('@g.us');

        const imageMsg = viewOnceMsg.imageMessage;
        const videoMsg = viewOnceMsg.videoMessage;
        const audioMsg = viewOnceMsg.audioMessage;

        let mediaMsg = null, mediaType = null;
        let caption = '', mimetype = '', ptt = false;

        if (imageMsg) {
            mediaMsg = imageMsg; mediaType = 'image'; caption = imageMsg.caption || '';
        } else if (videoMsg) {
            mediaMsg = videoMsg; mediaType = 'video'; caption = videoMsg.caption || '';
        } else if (audioMsg) {
            mediaMsg = audioMsg; mediaType = 'audio';
            mimetype = audioMsg.mimetype || 'audio/ogg; codecs=opus';
            ptt = audioMsg.ptt || false;
        } else {
            return;
        }

        const buffer = await downloadWithRetry(mediaMsg, mediaType);

        const ownerCaption =
            `👁️ *View Once Auto-Reveal*\n` +
            `📌 *Chat:* ${isGroup ? chatId : 'Private'}\n` +
            `👤 *Sender:* @${senderNum}\n` +
            (caption ? `📝 *Caption:* ${caption}` : '');

        // Sirf owner ko forward karo
        if (CONFIG.FORWARD_TO_OWNER && ownerJid !== sender) {
            await sendMedia(sock, ownerJid, mediaType, buffer, ownerCaption, mimetype, ptt, null);

            if (mediaType === 'audio') {
                await sock.sendMessage(ownerJid, {
                    text: ownerCaption + `\n${ptt ? '🎤 *Type:* Voice Note' : '🎵 *Type:* Audio'}`
                });
            }
        }

        console.log(`[ViewOnce] ✅ Auto-revealed ${mediaType} from ${senderNum} → owner`);

    } catch (err) {
        console.error('[ViewOnce Auto] ❌ Error:', err.message);
    }
}

module.exports = viewonceCommand;
module.exports.autoRevealViewOnce = autoRevealViewOnce;
module.exports.CONFIG = CONFIG;
