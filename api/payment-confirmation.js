const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    const { imageData, imageName, ...booking } = body || {};
    if (!booking.name || !booking.discord || !booking.telegram || !booking.reference || !imageData) {
      return response.status(400).json({ error: "Name, Discord, Telegram contact, and payment image are required." });
    }

    const imageMatch = imageData.match(/^data:image\/(png|jpeg|jpg);base64,([\s\S]+)$/);
    if (!imageMatch) {
      return response.status(400).json({ error: "Upload a PNG or JPG payment screenshot." });
    }
    const image = Buffer.from(imageMatch[2], "base64");
    if (image.length > MAX_IMAGE_BYTES) {
      return response.status(413).json({ error: "Keep the payment image under 3 MB." });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return response.status(503).json({ error: "Telegram is not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to Vercel project environment variables." });
    }

    const extension = imageMatch[1] === "jpeg" ? "jpg" : imageMatch[1];
    const filename = `${String(booking.reference).replace(/[^a-zA-Z0-9-]/g, "")}.${extension}`;
    const caption = [
      `NEW PAYMENT REFERENCE · ${booking.reference}`,
      `Name: ${booking.name}`,
      `Discord: ${booking.discord}`,
      `Telegram contact: ${booking.telegram}`,
      `Date: ${booking.date || "Not provided"}`,
      `Service: ${booking.service || "Not provided"}`,
      `Amount: $${booking.total || "0"} USD`,
      `Request: ${String(booking.request || "None").slice(0, 300)}`,
      `Uploaded: ${imageName || "payment screenshot"}`,
    ].join("\n").slice(0, 1024);

    const form = new FormData();
    form.set("chat_id", chatId);
    form.set("caption", caption);
    form.set("photo", new Blob([image], { type: imageMatch[1] === "png" ? "image/png" : "image/jpeg" }), filename);
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: form });
    const telegramResult = await telegramResponse.json();
    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram payment notification failed:", telegramResult.description || telegramResponse.statusText);
      return response.status(502).json({ error: "Telegram could not receive the payment confirmation. Check the bot settings and try again." });
    }

    return response.status(200).json({ ok: true, reference: booking.reference });
  } catch (error) {
    console.error("Payment confirmation failed:", error.message);
    return response.status(500).json({ error: "Could not send the payment confirmation. Please try again." });
  }
}
