"use client";

import { useEffect, useState } from "react";

const images = [
  "/images/hero/carousel-image-1.jpg",
  "/images/hero/carousel-image-2.jpg",
  "/images/hero/carousel-image-3.jpg",
  "/images/hero/carousel-image-4.jpg",
  "/images/hero/carousel-image-5.jpg",
  "/images/hero/carousel-image-6.jpg",
];

export default function HeroBackgroundCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ${
            i === index ? "opacity-60" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${src})`,
          }}
        />
      ))}
    </div>
  );
}