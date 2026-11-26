export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("OK", { status: 200 });
    try {
      const body = await request.json();
      const event = body?.data;
      if (event?.event_type === "message.received") {
        const p = event.payload;
        const to = p?.to?.[0]?.phone_number || "Unknown";
        const from = p?.from?.phone_number || "Unknown";
        const text = p?.text || "(No text)";
        const media = Array.isArray(p?.media) && p.media.length > 0 ? `\nMedia: ${p.media.map(m => m.url).join(", ")}` : "";
        const msg = `New SMS\nTo: ${to}\nFrom: ${from}\n\n${text}${media}`;
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: msg })
        });
      }
    } catch (err) {}
    return new Response("OK", { status: 200 });
  }
};
