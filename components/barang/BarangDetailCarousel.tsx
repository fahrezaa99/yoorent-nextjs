"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function BarangDetailCarousel({
  images = [],
  nama = "Barang",
}: {
  images: string[];
  nama?: string;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const [modalRef, modalInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: currentSlide,
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  if (!images || images.length === 0) {
    images = ["/placeholder.png"];
  }

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto">
        <div
          ref={sliderRef}
          className="keen-slider aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden bg-gray-100"
        >
          {images.map((img, idx) => (
            <div
              className="keen-slider__slide flex items-center justify-center relative cursor-pointer"
              key={idx}
              onClick={() => {
                setCurrentSlide(idx);
                setPreviewOpen(true);
              }}
            >
              <Image
                src={img}
                alt={`${nama} foto ${idx + 1}`}
                fill
                className="object-contain w-full h-full max-h-[500px] transition"
                sizes="(max-width: 768px) 100vw, 600px"
                unoptimized
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow z-20"
              aria-label="Sebelumnya"
              type="button"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow z-20"
              aria-label="Selanjutnya"
              type="button"
            >
              <ChevronRight size={28} />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full border transition-all duration-200 ${
                    i === currentSlide
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-blue-200"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Preview */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl h-[90vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full z-50"
              aria-label="Tutup"
            >
              <X size={24} />
            </button>

            <div className="keen-slider h-full" ref={modalRef}>
              {images.map((img, idx) => (
                <div
                  className="keen-slider__slide flex items-center justify-center"
                  key={idx}
                >
                  <Image
                    src={img}
                    alt={`Preview ${nama} - ${idx + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() => modalInstanceRef.current?.prev()}
                  className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow z-50"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => modalInstanceRef.current?.next()}
                  className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow z-50"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
