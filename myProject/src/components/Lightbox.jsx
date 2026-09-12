import React, { useCallback, useEffect, useState } from "react";

/**
 * Frontend-only image lightbox / gallery.
 * Renders the selected image prominently with prev/next controls,
 * a photo counter (e.g. 1/3), a close button, and keyboard support
 * (Escape to close, ArrowLeft/ArrowRight to navigate).
 *
 * Props:
 *  - images: string[]  (uses the spot's existing imageUrls array)
 *  - title: string     (optional caption)
 *  - startIndex: number
 *  - onClose: () => void
 */
const Lightbox = ({ images = [], title = "", startIndex = 0, onClose }) => {
  const total = images.length;
  const [index, setIndex] = useState(startIndex);

  const goPrev = useCallback(
    (e) => {
      e?.stopPropagation();
      setIndex((i) => (i - 1 + total) % total);
    },
    [total]
  );

  const goNext = useCallback(
    (e) => {
      e?.stopPropagation();
      setIndex((i) => (i + 1) % total);
    },
    [total]
  );

  // Keyboard navigation + lock body scroll while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [goPrev, goNext, onClose]);

  if (total === 0) return null;

  const hasMultiple = total > 1;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} photos` : "Photo gallery"}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        aria-label="Close gallery"
        className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* Photo counter */}
      {hasMultiple && (
        <span className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-sm font-medium text-white/90 bg-white/10 ring-1 ring-white/20 rounded-full px-3 py-1">
          {index + 1}/{total}
        </span>
      )}

      {/* Prev control */}
      {hasMultiple && (
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous photo"
          className="absolute left-3 sm:left-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      )}

      {/* Main image + caption */}
      <figure
        className="max-w-5xl max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={title ? `${title} (${index + 1} of ${total})` : `Photo ${index + 1} of ${total}`}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
        />
        {title && (
          <figcaption className="mt-4 text-center text-sm text-white/80">{title}</figcaption>
        )}
      </figure>

      {/* Next control */}
      {hasMultiple && (
        <button
          type="button"
          onClick={goNext}
          aria-label="Next photo"
          className="absolute right-3 sm:right-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Lightbox;
