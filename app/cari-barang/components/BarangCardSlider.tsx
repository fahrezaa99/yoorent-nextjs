// components/barang/BarangCardSlider.tsx
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

export default function BarangCardSlider({ fotoList, nama }: { fotoList: string[]; nama: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  return (
    <div className="relative h-48 w-full keen-slider rounded-xl overflow-hidden">
      <div ref={sliderRef} className="keen-slider h-48">
        {fotoList.map((img, i) => (
          <div className="keen-slider__slide flex items-center justify-center h-48 bg-gray-100" key={i}>
            <Image
              src={img}
              alt={nama}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 768px) 100vw, 320px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      {fotoList.length > 1 && (
        <>
          <button
            onClick={e => {
              e.preventDefault();
              instanceRef.current?.prev();
            }}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600 rounded-full p-1 shadow z-20"
            tabIndex={-1}
            aria-label="Sebelumnya"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={e => {
              e.preventDefault();
              instanceRef.current?.next();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-600 rounded-full p-1 shadow z-20"
            tabIndex={-1}
            aria-label="Selanjutnya"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
            {fotoList.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${i === currentSlide ? "bg-blue-600" : "bg-gray-300"} inline-block`}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
