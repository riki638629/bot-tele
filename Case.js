/*
Haloo I am GyzenLyoraa, Thank You For Using This Script, Don't Delete The Source

• Gunakan Script Dengan Bijak
• Jangan Di Pejual Belikan 
• Script Ini 100% Free
• Jika Ada Yang Menjual Nya Segera lapor Owner!!

# Vortunix Botz Jaga Group Telegram!! 1.0.0!!

#- Conntact Telegram : https://t.me/GyzenVtx 
#- Channel Telegram : https://t.me/AboutGyzenLyoraa
$- Conntact Whatsapp : https://wa.me/6200000000
#- Channel Whatsapp : https://whatsapp.com/channel/0029Vb6RKZO8qIzs8isITn3C
|== Jangan hapus Credit ==|

#Respect
*/
const { Telegraf } = require('telegraf');
const { BOT_TOKEN, REQUIRED_CHANNEL, START_IMAGE_URL, OWNER_ID } = require('./config');

const bot = new Telegraf(BOT_TOKEN);

const activeGroups = new Set();
const userViolations = {};
const groupWarnWords = {};
const groupWelcomeMessages = {};

// /start — support grup & pribadi + font stylish
bot.start((ctx) => {
  const { id, type, title, first_name } = ctx.chat;
  const name = type === 'private' ? first_name : title;

  const caption = `
✦ Bot Vortunix Penjaga Group Telegram ✦

𝖧𝖺𝗅𝗅𝗈 ${name} 👋
𝖡𝗈𝗍 𝗂𝗇𝗂 𝖽𝗂𝗋𝖺𝗇𝖼𝖺𝗇𝗀 𝗎𝗇𝗍𝗎𝗄 𝗆𝖾𝗇𝗃𝖺𝗀𝖺 𝗀𝗋𝗎𝗉 𝖽𝖺𝗋𝗂 𝗌𝗉𝖺𝗆 𝗅𝗂𝗇𝗄 𝖽𝖺𝗇 𝗄𝖺𝗍𝖺 𝗍𝖾𝗋𝗅𝖺𝗋𝖺𝗇𝗀.

✦ 𝖥𝗂𝗍𝗎𝗋 𝖴𝗍𝖺𝗆𝖺 ✦
• /antilink — 𝖧𝖺𝗉𝗎𝗌 𝗅𝗂𝗇𝗄 & 𝗆𝗎𝗍𝖾 𝗉𝖾𝗅𝖺𝗇𝗀𝗀𝖺𝗋
• /setwarn kata — 𝖠𝗍𝗎𝗋 𝗄𝖺𝗍𝖺 𝗍𝖾𝗋𝗅𝖺𝗋𝖺𝗇𝗀
• /removewarn — 𝖧𝖺𝗉𝗎𝗌 𝗄𝖺𝗍𝖺 𝗉𝖾𝗋𝗂𝗇𝗀𝖺𝗍𝖺𝗇
• /setwelcome pesan — 𝖲𝖺𝗆𝖻𝗎𝗍 𝗆𝖾𝗆𝖻𝖾𝗋 𝖻𝖺𝗋𝗎
• /status — 𝖢𝖾𝗄 𝗌𝗍𝖺𝗍𝗎𝗌 𝖿𝗂𝗍𝗎𝗋
• /listgroup — 𝖫𝗂𝗌𝗍 𝗀𝗋𝗎𝗉 𝖺𝗄𝗍𝗂𝖿 (𝗈𝗐𝗇𝖾𝗋 𝗈𝗇𝗅𝗒)

✦ 𝖡𝗈𝗍 𝖺𝗄𝗍𝗂𝖿 𝗃𝗂𝗄𝖺 𝗉𝖾𝗇𝗀𝗀𝗎𝗇𝖺 𝗌𝗎𝖽𝖺𝗁 𝗆𝖺𝗌𝗎𝗄 ${REQUIRED_CHANNEL} ✦
`;

  ctx.replyWithPhoto({ url: START_IMAGE_URL }, {
    caption,
    parse_mode: 'Markdown'
  });
});

// Validasi channel saat bot ditambahkan ke grup
bot.on('chat_member', async (ctx) => {
  const newMember = ctx.chatMember.new_chat_member;
  const botId = ctx.botInfo.id;

  if (newMember.user.id === botId && newMember.status === 'member') {
    const chatId = ctx.chat.id;
    const inviterId = ctx.chatMember.from.id;

    try {
      const member = await ctx.telegram.getChatMember(REQUIRED_CHANNEL, inviterId);
      const status = member.status;

      if (['member', 'administrator', 'creator'].includes(status)) {
        await ctx.telegram.sendMessage(chatId, `✅ Bot aktif. Terima kasih sudah bergabung dengan ${REQUIRED_CHANNEL}`);
      } else {
        await ctx.telegram.sendMessage(chatId, `❌ Anda belum bergabung dengan ${REQUIRED_CHANNEL}. Bot akan keluar.`);
        await ctx.telegram.leaveChat(chatId);
      }
    } catch (err) {
      await ctx.telegram.sendMessage(chatId, `❌ Gagal verifikasi keanggotaan ${REQUIRED_CHANNEL}. Bot akan keluar.`);
      await ctx.telegram.leaveChat(chatId);
    }
  }
});

// /antilink
bot.command('antilink', (ctx) => {
  activeGroups.add(ctx.chat.id);
  ctx.reply('✅ Fitur anti-link sudah aktif di grup ini.');
});

// /setwarn kata
bot.command('setwarn', (ctx) => {
  const chatId = ctx.chat.id;
  const input = ctx.message.text.split(' ').slice(1).join(' ').trim();

  if (!input) return ctx.reply('❌ Format salah. Contoh: /setwarn p');

  groupWarnWords[chatId] = input.toLowerCase();
  ctx.reply(`⚠️ Kata yang diperingatkan telah di-set: ${input}`);
});

// /removewarn
bot.command('removewarn', (ctx) => {
  const chatId = ctx.chat.id;
  if (groupWarnWords[chatId]) {
    const removed = groupWarnWords[chatId];
    delete groupWarnWords[chatId];
    ctx.reply(`✅ Kata yang diperingatkan "${removed}" telah dihapus.`);
  } else {
    ctx.reply('⚠️ Belum ada kata yang diperingatkan di grup ini.');
  }
});

// /setwelcome pesan
bot.command('setwelcome', (ctx) => {
  const chatId = ctx.chat.id;
  const input = ctx.message.text.split(' ').slice(1).join(' ').trim();

  if (!input) return ctx.reply('❌ Format salah. Contoh: /setwelcome Selamat datang!');

  groupWelcomeMessages[chatId] = input;
  ctx.reply(`👋 Pesan sambutan telah di-set: "${input}"`);
});

// /status
bot.command('status', (ctx) => {
  const chatId = ctx.chat.id;
  const isAntiLink = activeGroups.has(chatId);
  const warnWord = groupWarnWords[chatId] || 'Belum diatur';
  const welcome = groupWelcomeMessages[chatId] || 'Belum diatur';

  ctx.reply(`
✦ *STATUS FITUR GRUP* ✦

• Anti-Link: ${isAntiLink ? '✅ Aktif' : '❌ Tidak aktif'}
• Kata Terlarang: ${warnWord}
• Pesan Sambutan: ${welcome}
`, { parse_mode: 'Markdown' });
});

// /listgroup — hanya owner
bot.command('listgroup', async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.reply('❌ Perintah ini hanya bisa digunakan oleh owner bot.');

  if (activeGroups.size === 0) return ctx.reply('📭 Belum ada grup yang mengaktifkan fitur antilink.');

  let result = '✦ *Daftar Grup dengan Anti-Link Aktif* ✦\n\n';
  for (const groupId of activeGroups) {
    try {
      const chat = await ctx.telegram.getChat(groupId);
      const title = chat.title || 'Grup Tanpa Nama';
      const inviteLink = chat.invite_link || 'Belum tersedia';

      result += `• *${title}*\n  ID: \`${groupId}\`\n  Link: ${inviteLink}\n\n`;
    } catch {
      result += `• Grup ID: \`${groupId}\` (❌ Gagal ambil info)\n\n`;
    }
  }

  ctx.reply(result, { parse_mode: 'Markdown' });
});

// Sambut member baru
bot.on('new_chat_members', (ctx) => {
  const chatId = ctx.chat.id;
  const welcome = groupWelcomeMessages[chatId];
  if (welcome) {
    ctx.reply(welcome);
  }
});

// Deteksi pelanggaran (link atau kata terlarang)
bot.on('message', async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  const messageText = (ctx.message.text || '').toLowerCase();

  const warnWord = groupWarnWords[chatId];
  const containsLink = messageText.includes('https://') || messageText.includes('http://') || messageText.includes('.com');
  const containsWarn = warnWord && messageText.includes(warnWord);

  if (!containsLink && !containsWarn) return;

  try {
    await ctx.deleteMessage();

    const key = `${chatId}:${userId}`;
    userViolations[key] = (userViolations[key] || 0) + 1;
    const count = userViolations[key];

    await ctx.restrictChatMember(userId, {
      permissions: { can_send_messages: false },
      until_date: Math.floor(Date.now() / 1000) + 20 * 60,
    });

    await ctx.reply(`⚠️ @${username} melanggar aturan: ${containsLink ? 'link' : warnWord}\n🔇 Anda di-mute selama 20 menit.\n📌 Jumlah pelanggaran: ${count}${count >= 3 ? '\n🚪 Anda akan dikeluarkan dari grup.' : ''}`);

    if (count >= 3) {
      await ctx.kickChatMember(userId);
      await ctx.reply(`🚫 @${username} telah dikeluarkan dari grup karena melanggar 3x.`);
    }
  } catch (err) {
    console.error('Gagal proses pelanggaran:', err);
  }
});

bot.launch();

/*
Haloo I am GyzenLyoraa, Thank You For Using This Script, Don't Delete The Source

• Gunakan Script Dengan Bijak
• Jangan Di Pejual Belikan 
• Script Ini 100% Free
• Jika Ada Yang Menjual Nya Segera lapor Owner!!

# Vortunix Botz Jaga Group Telegram!! 1.0.0!!

#- Conntact Telegram : https://t.me/GyzenVtx 
#- Channel Telegram : https://t.me/AboutGyzenLyoraa
$- Conntact Whatsapp : https://wa.me/6200000000
#- Channel Whatsapp : https://whatsapp.com/channel/0029Vb6RKZO8qIzs8isITn3C
|== Jangan hapus Credit ==|

#Respect
*/