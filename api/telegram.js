
export default async function handler(req, res) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
  const WEBAPP_URL = process.env.NEXORA_WEBAPP_URL;

  // Accept POST requests only
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // Check server configuration
  if (!BOT_TOKEN || !WEBHOOK_SECRET || !WEBAPP_URL) {
    console.error("Telegram environment variables are missing.");

    return res.status(500).json({
      success: false,
      error: "Server configuration incomplete"
    });
  }

  // Verify Telegram webhook secret
  const receivedSecret =
    req.headers["x-telegram-bot-api-secret-token"];

  if (receivedSecret !== WEBHOOK_SECRET) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  try {
    const update = req.body || {};
    const message = update.message;

    // Ignore updates without a text message
    if (!message || typeof message.text !== "string") {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat?.id;
    const text = message.text.trim();

    if (!chatId || !text) {
      return res.status(200).json({ ok: true });
    }

    let reply;

    if (text === "/start" || text.startsWith("/start ")) {
      reply =
        "🚀 به NEXORA خوش آمدید!\n\n" +
        "Beyond the Ordinary.\n\n" +
        "🌐 دنیایی از سرگرمی، آموزش، خلاقیت و ابزارهای دیجیتال.\n\n" +
        "🎮 بازی | 📰 اخبار | 🛍 بازار\n" +
        "🎨 خلاقیت | 🛠 ابزارها | 📚 آموزش\n\n" +
        "Welcome to NEXORA!\n" +
        "Explore entertainment, learning, creativity and digital tools.\n\n" +
        "NEXORA — One Platform. Endless Possibilities.";
    } else if (text === "/help") {
      reply =
        "راهنمای NEXORA\n\n" +
        "/start - شروع\n" +
        "/help - راهنما\n\n" +
        "NEXORA — One Platform. Endless Possibilities.";
    } else {
      reply =
        "پیام شما دریافت شد.\n" +
        "بخش هوش مصنوعی NEXORA هنوز در حال راه‌اندازی است.\n\n" +
        "Your message was received. NEX AI is being prepared.";
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Open NEXORA",
                  web_app: {
                    url: WEBAPP_URL
                  }
                }
              ]
            ]
          }
        })
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      console.error("Telegram API request failed.");

      return res.status(502).json({
        success: false,
        error: "Telegram API request failed"
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Telegram webhook error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
