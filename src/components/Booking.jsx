import { useState } from "react";
import { contacts } from "../data/contacts";
import {
  ArrowLeft,
  Camera,
  Check,
  Clock3,
  CreditCard,
  MessageCircle,
  Send,
  Upload,
  X,
} from "lucide-react";

const currency = (amount) => `$${Number(amount).toFixed(2)} USD`;

export default function Booking({ video, selected, setVideo, choose, total }) {
  const [invoice, setInvoice] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const startInvoice = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setInvoice({
      name: form.get("name"),
      discord: form.get("discord"),
      telegram: form.get("telegram") || "Not provided",
      date: form.get("date"),
      service: video ? "Short Cinematic Video" : selected,
      request: form.get("request") || "No special requests",
      total,
      reference: `WS-${Date.now().toString(36).toUpperCase()}`,
    });
    setError("");
    setDone(false);
  };

  const selectReceipt = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!(["image/png", "image/jpeg"].includes(file.type)) || file.size > 3 * 1024 * 1024) {
      setError("Choose a PNG or JPG payment screenshot under 3 MB.");
      event.target.value = "";
      return;
    }
    setReceipt(file);
    setReceiptPreview(URL.createObjectURL(file));
    setError("");
  };

  const submitPayment = async () => {
    if (!receipt) {
      setError("Upload your payment reference screenshot to continue.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read the image."));
        reader.readAsDataURL(receipt);
      });
      const response = await fetch("/api/payment-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...invoice, imageData, imageName: receipt.name }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send confirmation.");
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not send confirmation. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="book" className="booking section">
      <div className="booking-copy">
        <div className="section-label">06 / BOOKING</div>
        <h2>
          Let's make
          <br />
          <span>your scene.</span>
        </h2>
        <p>
          Ready to create something for your character, crew or gang? Send the
          details and we'll confirm the final quote with you.
        </p>
        <div className="contact-lines">
          <a href={contacts.telegram.url} target="_blank" rel="noreferrer"><Send size={16} /> Telegram: {contacts.telegram.label}</a>
          <a href={contacts.discord.url} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Discord: {contacts.discord.label}</a>
          <a href={contacts.instagram.url} target="_blank" rel="noreferrer"><Camera size={16} /> Instagram: {contacts.instagram.label}</a>
          <span><Clock3 size={16} /> Response: within 24h</span>
        </div>
      </div>

      {!invoice ? (
        <form onSubmit={startInvoice} className="booking-form glass-panel">
          <div className="form-row">
            <label>YOUR NAME<input name="name" required placeholder="Your name" /></label>
            <label>DISCORD<input name="discord" required placeholder="username" /></label>
          </div>
          <div className="form-row">
            <label>TELEGRAM CONTACT<input name="telegram" required placeholder="@username or t.me/username" /></label>
            <label>DATE<input name="date" type="date" required /></label>
          </div>
          <label>SERVICE
            <select value={video ? "video" : selected} onChange={(event) => event.target.value === "video" ? setVideo(true) : choose(event.target.value)}>
              <option value="single">Single — $1</option>
              <option value="couple">Couple — $3</option>
              <option value="trio">Trio — $4</option>
              <option value="squad">Squad — $6</option>
              <option value="gang">Gang — $10</option>
              <option value="video">Short Video — $15+</option>
            </select>
          </label>
          <label>YOUR REQUEST<textarea name="request" rows="5" placeholder="Tell us about the scene, location, cars, props, poses, graphics, etc." /></label>
          <div className="form-total"><span>Estimated base</span><b>{currency(total)}</b></div>
          <button className="btn primary full" type="submit">SEND BOOKING REQUEST <CreditCard size={15} /></button>
        </form>
      ) : (
        <div className="invoice-card glass-panel">
          <div className="invoice-heading">
            <div><span className="pill">BOOKING INVOICE</span><h3>Payment details</h3></div>
            <span className="invoice-ref">{invoice.reference}</span>
          </div>
          <div className="invoice-summary">
            <div><small>CLIENT</small><b>{invoice.name}</b></div>
            <div><small>DISCORD</small><b>{invoice.discord}</b></div>
            <div><small>TELEGRAM CONTACT</small><b>{invoice.telegram}</b></div>
            <div><small>DATE</small><b>{invoice.date}</b></div>
            <div><small>SERVICE</small><b>{invoice.service === "video" ? "Short Cinematic Video" : invoice.service.charAt(0).toUpperCase() + invoice.service.slice(1)}</b></div>
            <div className="invoice-total"><small>AMOUNT DUE</small><b>{currency(invoice.total)}{video ? "+" : ""}</b></div>
          </div>
          <div className="payment-instructions">
            <div className="qr-frame">
              <img src="/public/gallery/payment-qr.JPG" alt="WestSide Studio payment QR" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false; }} />
              <div className="qr-placeholder" hidden><CreditCard size={28} /><b>Payment QR needed</b><span>Add your real QR image as <code>public/payment-qr.png</code></span></div>
            </div>
            <div><span className="section-label">PAYMENT</span><p>Scan the studio's payment QR, then upload a screenshot or payment reference below.</p><small>Your booking is only confirmed after the payment is reviewed.</small></div>
          </div>
          <label className="receipt-upload">
            <span><Upload size={17} /> {receipt ? "CHANGE PAYMENT SCREENSHOT" : "UPLOAD PAYMENT SCREENSHOT"}</span>
            <small>{receipt ? `Selected: ${receipt.name}` : "PNG or JPG, up to 3 MB"}</small>
            <input type="file" accept="image/*" onChange={selectReceipt} />
          </label>
          {receiptPreview && <div className="receipt-preview"><img src={receiptPreview} alt="Selected payment screenshot preview" /><button type="button" onClick={() => { URL.revokeObjectURL(receiptPreview); setReceiptPreview(""); setReceipt(null); }} aria-label="Remove screenshot"><X size={15} /></button></div>}
          {error && <p className="payment-error" role="alert">{error}</p>}
          {done ? <div className="success"><Check size={17} /> Payment reference sent. Your booking and screenshot are with the studio for review.</div> : <button className="btn primary full" type="button" disabled={sending} onClick={submitPayment}>{sending ? "SENDING..." : "DONE — SEND PAYMENT REFERENCE"} <Send size={15} /></button>}
          <button className="invoice-back" type="button" onClick={() => { setInvoice(null); setError(""); }}><ArrowLeft size={14} /> EDIT BOOKING</button>
        </div>
      )}
    </section>
  );
}
