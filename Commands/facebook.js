const axios = require('axios');

async function fbdown(url) {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
    };

    try {
        const { data } = await axios.get(
            `https://api.hanggts.xyz/download/facebook?url=${encodeURIComponent(url)}`,
            { headers, timeout: 15000 }
        );
        if (data?.result?.media?.video_hd || data?.result?.media?.video_sd) {
            return {
                status: true,
                HD: data.result.media.video_hd || null,
                SD: data.result.media.video_sd || null,
                title: data.result.info?.title || 'Facebook Video'
            };
        }
    } catch {}

    try {
        const { data } = await axios.get(
            `https://api.nexray.eu.cc/downloader/v1/facebook?url=${encodeURIComponent(url)}`,
            { headers, timeout: 15000 }
        );
        if (data?.result?.url) {
            return { status: true, HD: data.result.url, SD: data.result.url, title: data.result.title || 'Facebook Video' };
        }
    } catch {}

    return { status: false };
}

async function facebookCommand(sock, chatId, message, directUrl = null) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const url = directUrl || text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            return await sock.sendMessage(chatId, {
                text: '📌 *Facebook Downloader*\n\nUsage: .fb <url>\nExample: .fb https://www.facebook.com/watch?v=xxx'
            }, { quoted: message });
        }

        if (!url.match(/facebook\.com|fb\.watch/i)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid URL. Please provide a Facebook link.'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        const data = await fbdown(url);

        if (!data?.status) {
            return await sock.sendMessage(chatId, {
                text: '❌ Failed to fetch video. Please try another link.'
            }, { quoted: message });
        }

        const videoUrl = data.HD || data.SD;
        if (!videoUrl) {
            return await sock.sendMessage(chatId, { text: '❌ Video not found.' }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            video: { url: videoUrl },
            caption: `*📘 Facebook Video*\n\n📝 ${data.title || 'Facebook Video'}\n🎬 Quality: ${data.HD ? 'HD' : 'SD'}`
        }, { quoted: message });

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (err) {
        console.error('[Facebook] Error:', err.message);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, {
            text: '❌ Failed to download Facebook video. Please try again.'
        }, { quoted: message });
    }
}

module.exports = facebookCommand;
