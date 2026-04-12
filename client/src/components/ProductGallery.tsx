import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  placeholder: string;
}

export default function ProductGallery({ images, productName, placeholder }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const displayImages = images && images.length > 0 ? images : [placeholder];
  const currentImage = displayImages[selectedImage];

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative aspect-[3/4] bg-cream rounded-sm overflow-hidden group cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={currentImage}
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? "scale-150" : "scale-100"
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : undefined
          }
        />

        {/* Zoom Indicator */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={14} className="text-navy" />
          <span className="text-xs text-navy font-medium">Zoom</span>
        </div>

        {/* Navigation Arrows (visible on mobile and when multiple images) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} className="text-navy" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={20} className="text-navy" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-navy/80 text-white px-3 py-1 rounded-full text-xs font-medium">
            {selectedImage + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedImage(i);
                setIsZoomed(false);
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all hover:border-gold/50 ${
                selectedImage === i ? "border-gold ring-2 ring-gold/30" : "border-navy/10"
              }`}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Image Info */}
      {displayImages.length > 1 && (
        <p className="text-xs text-navy/40 text-center">
          Haz clic en la imagen para ampliar • Arrastra para ver detalles
        </p>
      )}
    </div>
  );
}
