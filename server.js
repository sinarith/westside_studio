import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const production = process.env.NODE_ENV === "production" || process.argv.includes("--production");
const uploadDir = path.join(root, "uploads");
const mimeTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp3": "audio/mpeg", ".woff2": "font/woff2" };

if (existsSync(path.join(root, ".env"))) {
  const contents = await readFile(path.join(root, ".env"), "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 4.4 * 1024 * 1024) throw new Error("Request is too large. Keep the image under 3 MB.");
  }
  return JSON.parse(body);
}

async function paymentConfirmation(request, response) {
  try {
    const { imageData, imageName, ...booking } = await readJson(request);
    if (!booking.name || !booking.discord || !booking.telegram || !booking.reference || !imageData) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Name, Discord, Telegram contact, and payment image are required." }));
      return;
    }
    const imageMatch = imageData.match(/^data:image\/(png|jpeg|jpg);base64,([\s\S]+)$/);
    if (!imageMatch) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Upload a PNG, JPG, or WEBP payment screenshot." }));
      return;
    }
    const image = Buffer.from(imageMatch[2], "base64");
    if (image.length > 3 * 1024 * 1024) {
      response.writeHead(413, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Keep the payment image under 3 MB." }));
      return;
    }
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      response.writeHead(503, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Telegram is not configured yet. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to .env." }));
      return;
    }

    const extension = imageMatch[1] === "jpeg" ? "jpg" : imageMatch[1];
    const safeName = `${Date.now()}-${String(booking.reference).replace(/[^a-zA-Z0-9-]/g, "")}.${extension}`;
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, safeName), image);
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
    form.set("chat_id", process.env.TELEGRAM_CHAT_ID);
    form.set("caption", caption);
    const contentType = imageMatch[1] === "png" ? "image/png" : "image/jpeg";
    form.set("photo", new Blob([image], { type: contentType }), safeName);
    const telegramResponse = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, { method: "POST", body: form });
    const telegramResult = await telegramResponse.json();
    if (!telegramResponse.ok || !telegramResult.ok) throw new Error(telegramResult.description || "Telegram could not send the payment confirmation.");

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true, reference: booking.reference }));
  } catch (error) {
    const status = error instanceof SyntaxError || error.message.startsWith("Request is too large") ? 400 : 500;
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: error.message || "Could not send the payment confirmation." }));
  }
}

let vite;
if (!production) {
  const { createServer: createViteServer } = await import("vite");
  vite = await createViteServer({ server: { middlewareMode: true }, appType: "custom" });
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/api/payment-confirmation" && request.method === "POST") return paymentConfirmation(request, response);
  if (pathname.startsWith("/api/")) {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "API route not found." }));
    return;
  }
  if (production) {
    const filePath = path.resolve(root, "dist", `.${decodeURIComponent(pathname)}`);
    if (!filePath.startsWith(path.resolve(root, "dist") + path.sep) && filePath !== path.resolve(root, "dist", "index.html")) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    const target = pathname === "/" ? path.join(root, "dist", "index.html") : filePath;
    try {
      const content = await readFile(target);
      response.writeHead(200, { "Content-Type": mimeTypes[path.extname(target)] || "application/octet-stream" });
      response.end(content);
    } catch {
      const html = await readFile(path.join(root, "dist", "index.html"));
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(html);
    }
    return;
  }
  if (pathname === "/" || pathname.endsWith(".html")) {
    const html = await vite.transformIndexHtml(pathname, await readFile(path.join(root, "index.html"), "utf8"));
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(html);
    return;
  }
  vite.middlewares(request, response, () => response.writeHead(404).end("Not found"));
});

const port = Number(process.env.PORT || 5173);
server.listen(port, "0.0.0.0", () => console.log(`WestSide Studio server running at http://localhost:${port}`));
