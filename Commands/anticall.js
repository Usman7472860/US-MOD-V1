// commands/anticall.js
// Warning system: 1st call = 1st warning, 2nd = 2nd warning, 3rd = block warning, 4th = AUTO BLOCK

const fs = require('fs');

const ANTICALL_PATH  = './data/anticall.json';
const WARNINGS_PATH  = './data/anticall_warnings.json';

// ─── State helpers ────────────────────────────────────────────────────────────

function readState() {
    try {
        if (!fs.existsSync(ANTICALL_PATH)) return { enabled: false };
        const data = JSON.parse(fs.readFileSync(ANTICALL_PATH, 'utf8') || '{}');
        return { enabled: !!data.enabled };
    } catch {
        return { enabled: false };
    }
}

function writeState(enabled) {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
        fs.writeFileSync(ANTICALL_PATH, JSON.stringify({ enabled: !!enabled }, null, 2));
    } catch {}
}

// ─── Warning store helpers ────────────────────────────────────────────────────

function readWarnings() {
    try {
        if (!fs.existsSync(WARNINGS_PATH)) return {};
        return JSON.parse(fs.readFileSync(WARNINGS_PATH, 'utf8') || '{}');
    } catch {
        return {};
    }
}

function saveWarnings(data) {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
        fs.writeFileSync(WARNINGS_PATH, JSON.stringify(data, null, 2));
    } catch {}
}

function getWarningCount(jid) {
    const w = readWarnings();
    return w[jid] || 0;
}

function incrementWarning(jid) {
    const w = readWarnings();
    w[jid] = (w[jid] || 0) + 1;
    saveWarnings(w);
    return w[jid];
}

function resetWarnings(jid) {
    const w = readWarnings();
    delete w[jid];
    saveWarnings(w);
}

// ─── Main call handler ────────────────────────────────────────────────────────

async function handleIncomingCall(sock, callEvent) {
    try {
        const state = readState();
        if (!state.enabled) return;

        // callEvent is array from sock.ev.on('call', ...)
        const calls = Array.isArray(callEvent) ? callEvent : [callEvent];

        for (const call of calls) {
            // Only act on incoming/ringing calls (not ended ones)
            if (call.status !== 'offer' && call.status !== 'ringing') continue;

            const callerJid = call.from;
            if (!callerJid) continue;

            const callerNum = callerJid.replace('@s.whatsapp.net', '').replace('@lid', '');

            // Reject the call first
            try {
                await sock.rejectCall(call.id, callerJid);
            } catch (e) {
                console.error('Call reject error:', e.message);
            }

            // Increment warning
            const count = incrementWarning(callerJid);

            console.log(`📵 Call from ${callerNum} — Warning ${count}/4`);

            if (count === 1) {
                // ── 1st warning ──
                await sock.sendMessage(callerJid, {
                    text:
                        `⚠️ *Warning 1/3*\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `📵 Calling this number is *not allowed.*\n\n` +
                        `Please *do not call* again.\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `_2 more warnings before you are blocked._`
                });

            } else if (count === 2) {
                // ── 2nd warning ──
                await sock.sendMessage(callerJid, {
                    text:
                        `⚠️ *Warning 2/3*\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `📵 You called *again* after a warning!\n\n` +
                        `This is your *second warning.*\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `🚨 *One more call and you will be BLOCKED.*`
                });

            } else if (count === 3) {
                // ── 3rd warning — final warning ──
                await sock.sendMessage(callerJid, {
                    text:
                        `🚨 *FINAL WARNING — 3/3*\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `❌ You have been warned *3 times.*\n\n` +
                        `If you call *one more time,* you will be\n` +
                        `*AUTOMATICALLY BLOCKED* with no further warning.\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `_This is your last chance._`
                });

            } else if (count >= 4) {
                // ── 4th call → AUTO BLOCK ──
                await sock.sendMessage(callerJid, {
                    text:
                        `🔴 *You have been BLOCKED!*\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `You ignored all 3 warnings and called again.\n` +
                        `You are now *permanently blocked.*\n` +
                        `━━━━━━━━━━━━━━━━━━`
                });

                // Block the user
                try {
                    await sock.updateBlockStatus(callerJid, 'block');
                    console.log(`🔴 AUTO BLOCKED: ${callerNum} after ${count} calls`);
                } catch (blockErr) {
                    console.error('Block error:', blockErr.message);
                }

                // Reset warnings after block (clean slate if unblocked later)
                resetWarnings(callerJid);
            }
        }
    } catch (e) {
        console.error('handleIncomingCall error:', e.message);
    }
}

// ─── .anticall command ────────────────────────────────────────────────────────

async function anticallCommand(sock, chatId, message, args) {
    const state = readState();
    const sub = (args || '').trim().toLowerCase();

    if (sub === 'status') {
        const warnings = readWarnings();
        const warnCount = Object.keys(warnings).length;
        await sock.sendMessage(chatId, {
            text:
                `📵 *Anticall Status*\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `Status: *${state.enabled ? '✅ ON' : '❌ OFF'}*\n` +
                `Tracked callers: *${warnCount}*\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `_Warning system: 3 warnings → auto block on 4th call_`
        }, { quoted: message });
        return;
    }

    if (sub === 'on') {
        writeState(true);
        await sock.sendMessage(chatId, {
            text:
                `✅ *Anticall ENABLED*\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `📵 Calls will be rejected automatically.\n\n` +
                `⚠️ *Warning system active:*\n` +
                `• 1st call → Warning 1\n` +
                `• 2nd call → Warning 2\n` +
                `• 3rd call → Final warning\n` +
                `• 4th call → 🔴 Auto Block\n` +
                `━━━━━━━━━━━━━━━━━━`
        }, { quoted: message });
        return;
    }

    if (sub === 'off') {
        writeState(false);
        await sock.sendMessage(chatId, {
            text: `❌ *Anticall DISABLED*\nCalls will no longer be blocked.`
        }, { quoted: message });
        return;
    }

    if (sub === 'reset') {
        // Reset all warnings (owner utility)
        saveWarnings({});
        await sock.sendMessage(chatId, {
            text: `🔄 All anticall warnings have been reset.`
        }, { quoted: message });
        return;
    }

    // Help menu
    await sock.sendMessage(chatId, {
        text:
            `📵 *Anticall Commands*\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `• \`.anticall on\`  — Enable\n` +
            `• \`.anticall off\` — Disable\n` +
            `• \`.anticall status\` — Show status\n` +
            `• \`.anticall reset\` — Clear all warnings\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `_Warning system: 3 warnings → auto block 4th call_`
    }, { quoted: message });
}

module.exports = { anticallCommand, readState, handleIncomingCall };
