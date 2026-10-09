import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
export default function Lightbox({ item, setItem }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setItem(null)}
        >
          <button onClick={() => setItem(null)} aria-label="Close">
            <X />
          </button>
          <img
            src={item.src}
            alt={item.title}
            onClick={(e) => e.stopPropagation()}
          />
          <div>
            <small>{item.tag}</small>
            <b>{item.title}</b>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
