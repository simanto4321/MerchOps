import { prisma } from "./prisma";

export async function notifyTelegram(message: string) {
  const settings = await prisma.appSetting.findMany({
    where: { key: { in: ["telegram_bot_token", "telegram_chat_id"] } },
  });
  const token =
    settings.find((s) => s.key === "telegram_bot_token")?.value ||
    process.env.TELEGRAM_BOT_TOKEN ||
    "";
  const chatId =
    settings.find((s) => s.key === "telegram_chat_id")?.value ||
    process.env.TELEGRAM_CHAT_ID ||
    "";

  if (!token || !chatId) {
    return { sent: false, reason: "Telegram bot token or chat id not configured" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { sent: false, reason: body };
    }
    return { sent: true };
  } catch (error) {
    return {
      sent: false,
      reason: error instanceof Error ? error.message : "Telegram request failed",
    };
  }
}
