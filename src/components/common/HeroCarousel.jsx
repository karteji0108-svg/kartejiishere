import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import Skeleton from './Skeleton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: "https://res.cloudinary.com/dbxktcwug/image/upload/v1/samples/landscapes/nature-mountains",
    title: "Bersatu Membangun Bangsa",
    subtitle: "Karang Taruna sebagai wadah pengembangan generasi muda",
    ctaText: "Bergabung Sekarang",
    ctaLink: "/members"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/dbxktcwug/image/upload/v1/samples/people/group-working",
    title: "Kegiatan Sosial & Masyarakat",
    subtitle: "Aktif berkontribusi untuk kesejahteraan lingkungan sekitar",
    ctaText: "Lihat Agenda",
    ctaLink: "/activities"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/dbxktcwug/image/upload/v1/samples/sports/soccer-playing",
    title: "Olahraga & Kreativitas",
    subtitle: "Menyalurkan bakat dan minat pemuda melalui kegiatan positif",
    ctaText: "Galeri Foto",
    ctaLink: "/gallery"
  },
  {
    id: 4,
    image: "https://res.cloudinary.com/dbxktcwug/image/upload/v1/samples/business/discussion",
    title: "Diskusi & Musyawarah",
    subtitle: "Mengutamakan mufakat dalam setiap pengambilan keputusan",
    ctaText: "Tentang Kami",
    ctaLink: "/profile"
  }
];

const getOptimizedUrl = (url) => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;
  // Check if transformations already exist to avoid duplication if passed manually
  if (url.includes('/f_auto,q_auto')) return url;

  return url.replace('/upload/', '/upload/f_auto,q_auto,c_fill,w_1600,ar_16:9/');
};

const HeroCarousel = ({ slides = DEFAULT_SLIDES }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

  // Initialize loading states for each slide
  useEffect(() => {
    const initialStates = slides.reduce((acc, slide) => {
      acc[slide.id] = true;
      return acc;
    }, {});
    setLoadingStates(initialStates);
  }, [slides]);

  const handleImageLoad = (id) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (e) => {
    // Fallback image
    e.target.src = 'https://res.cloudinary.com/dbxktcwug/image/upload/f_auto,q_auto/v1/samples/landscapes/architecture-signs';
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative mb-6 rounded-2xl overflow-hidden shadow-lg group">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={600}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={true}
        pagination={{ clickable: true }}
        className="w-full h-full aspect-video"
      >
        {slides.map((slide, index) => {
          const optimizedImage = getOptimizedUrl(slide.image);
          const isLoading = loadingStates[slide.id];

          return (
            <SwiperSlide key={slide.id || index} className="relative w-full h-full bg-gray-900">

              {/* Skeleton Loader */}
              {isLoading && (
                <div className="absolute inset-0 z-10">
                   <Skeleton className="w-full h-full" />
                </div>
              )}

              {/* Image */}
              <img
                src={optimizedImage}
                alt={slide.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                style={{ aspectRatio: '16/9' }}
                loading={index === 0 ? "eager" : "lazy"} // Eager load first slide
                onLoad={() => handleImageLoad(slide.id)}
                onError={handleImageError}
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none"></div>

              {/* Text Content - Glassmorphism */}
              <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-30 max-w-[80%] md:max-w-[60%] lg:max-w-[50%] pointer-events-auto">
                <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 p-4 md:p-6 rounded-xl shadow-lg">
                  <h1 className="text-white text-xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-gray-100 text-sm md:text-lg mb-4 drop-shadow-sm line-clamp-2 md:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  {slide.ctaLink && (
                    <Link
                      to={slide.ctaLink}
                      className="inline-block px-4 py-2 md:px-6 md:py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm md:text-base font-medium rounded-lg transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      aria-label={`${slide.ctaText}: ${slide.title}`}
                    >
                      {slide.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Global styles for Swiper navigation/pagination to match theme */}
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: white;
          width: 3rem;
          height: 3rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          width: 10px;
          height: 10px;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #ffffff;
          width: 24px;
          border-radius: 5px;
          transition: width 0.3s ease;
        }
        /* Mobile adjustments */
        @media (max-width: 768px) {
          .swiper-button-next, .swiper-button-prev {
            display: none; /* Hide arrows on mobile for cleaner look */
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
