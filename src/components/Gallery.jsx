import { useState } from "react";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export const gallery = Array.from({ length: 9 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    src: `/gallery/photo-${number}.jpg`,
    tag: "WestSide Studio",
    title: `Cinematic Photo`,
  };
});

function GallerySlot({ item, index, setLightbox }) {
  const [imageReady, setImageReady] = useState(false);

  return (
    <motion.button
      whileHover={imageReady ? { y: -5 } : undefined}
      key={item.src}
      className={`shot shot-${index} ${imageReady ? "has-photo" : "empty"}`}
      onClick={() => imageReady && setLightbox(item)}
      aria-label={imageReady ? `Open ${item.title}` : `Empty photo slot ${index + 1}`}
      aria-disabled={!imageReady}
      type="button"
    >
      <img src={item.src} alt={item.title} onLoad={() => setImageReady(true)} onError={() => setImageReady(false)} />
      {!imageReady && (
        <div className="gallery-placeholder">
          <ImageIcon size={25} />
          <b>ADD YOUR PHOTO</b>
          <small>{`public/gallery/photo-${String(index + 1).padStart(2, "0")}.jpg`}</small>
        </div>
      )}
      {imageReady && <div className="shot-overlay"><small>{item.tag}</small><b>{item.title}</b></div>}
    </motion.button>
  );
}

export default function Gallery({ setLightbox }) {
  return (
    <section id="gallery" className="gallery section">
      <div className="section-label">04 / SELECTED WORK</div>
      <div className="gallery-head">
        <h2>Made for the<br /><span>timeline.</span></h2>
        <a href="#book">REQUEST YOUR SESSION <ArrowRight size={15} /></a>
      </div>
      <div className="gallery-grid">
        {gallery.map((item, index) => <GallerySlot key={item.src} item={item} index={index} setLightbox={setLightbox} />)}
      </div>
    </section>
  );
}
