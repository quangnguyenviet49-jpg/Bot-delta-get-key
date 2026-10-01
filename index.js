const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('System Online'));
app.listen(3000, () => console.log('Web server is ready.'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = "!"; 

client.once('ready', () => {
    console.log(`Logged in as \${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'bypass') {
        const targetUrl = args[0];
        if (!targetUrl) return message.reply("❌ Cú pháp: `!bypass <link delta>`");
        const processing = await message.reply("⏳ Đang giải mã link Delta, vui lòng đợi...");
        try {
            const res = await axios.get(`https://bypass.vip\${encodeURIComponent(targetUrl)}`);
            if (res.data && res.data.result) {
                const embed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('🔑 KEY DELTA CỦA BẠN')
                    .setDescription(`\`\`\`${res.data.result}\`\`\``)
                    .setTimestamp();
                await processing.edit({ content: '✅ Thành công!', embeds: [embed] });
            } else {
                await processing.edit("❌ API lỗi hoặc link không hợp lệ.");
            }
        } catch (err) {
            await processing.edit("❌ Không thể kết nối tới máy chủ bypass.");
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
