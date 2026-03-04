const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Esto mantiene a Render feliz y despierto
app.get('/', (req, res) => res.send('Bot de Digitals en línea 🚀'));
app.listen(port, () => console.log(`Puerto ${port} abierto`));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    console.log('--- ESCANEA ESTE QR ---');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => console.log('¡WhatsApp de Digitals listo!'));

client.on('message', async msg => {
    if (msg.fromMe || msg.body.length > 500) return;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [
                    {"role": "system", "content": "Eres el asistente experto de la agencia Digitals. Responde de forma amable y profesional."},
                    {"role": "user", "content": msg.body}
                ]
            })
        });
        const data = await response.json();
        if (data.choices) msg.reply(data.choices[0].message.content);
    } catch (e) { console.error("Error en OpenRouter:", e); }
});

client.initialize();
