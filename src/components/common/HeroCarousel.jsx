import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { hasPermission, PERMISSIONS } from '../../constants/roles';
import Skeleton from './Skeleton';
import ManageHeroModal from './ManageHeroModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const getOptimizedUrl = (url) => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;
  if (url.includes('/f_auto,q_auto')) return url;

  return url.replace('/upload/', '/upload/f_auto,q_auto,c_fill,w_1600,ar_16:9/');
};

const HeroCarousel = () => {
  const { userRole } = useAuth();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState({});
  const [showManageModal, setShowManageModal] = useState(false);

  const canManage = hasPermission(userRole, PERMISSIONS.MANAGE_HERO);

  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSlides = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSlides(fetchedSlides);
      setLoading(false);

      // Reset image loading states when slides change
      const initialStates = fetchedSlides.reduce((acc, slide) => {
        acc[slide.id] = true;
        return acc;
      }, {});
      setLoadingImages(initialStates);
    });

    return () => unsubscribe();
  }, []);

  const handleImageLoad = (id) => {
    setLoadingImages(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (e) => {
    e.target.src = 'https://res.cloudinary.com/dbxktcwug/image/upload/f_auto,q_auto/v1/samples/landscapes/architecture-signs';
  };

  if (loading) {
    return <Skeleton className="w-full aspect-video rounded-2xl mb-6" />;
  }

  if (slides.length === 0) {
    if (canManage) {
      return (
        <>
          <div
            onClick={() => setShowManageModal(true)}
            className="w-full aspect-[16/9] mb-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-icons-round text-3xl">add_photo_alternate</span>
            </div>
            <h3 className="font-bold text-lg">Setup Hero Banner</h3>
            <p className="text-sm">Klik untuk menambahkan slide pertama</p>
          </div>
          {showManageModal && <ManageHeroModal slides={slides} onClose={() => setShowManageModal(false)} />}
        </>
      );
    }
    return null;
  }

  return (
    <div className="w-full relative mb-6 rounded-2xl overflow-hidden shadow-lg group">

      {/* Edit Button for Admins */}
      {canManage && (
        <button
          onClick={() => setShowManageModal(true)}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 shadow-lg"
          title="Kelola Slide"
        >
          <span className="material-icons-round text-xl">edit</span>
        </button>
      )}

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={slides.length > 1}
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
          const isLoading = loadingImages[slide.id];

          return (
            <SwiperSlide key={slide.id} className="relative w-full h-full bg-gray-900">

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
                loading={index === 0 ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(slide.id)}
                onError={handleImageError}
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none"></div>

              {/* Text Content - Glassmorphism */}
              {(slide.title || slide.subtitle) && (
                <div className="absolute top-1/2 left-4 md:left-12 -translate-y-1/2 z-30 max-w-[80%] md:max-w-[60%] lg:max-w-[50%] pointer-events-auto">
                  <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 p-4 md:p-6 rounded-xl shadow-lg">
                    {slide.title && (
                      <h1 className="text-white text-xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-md">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="text-gray-100 text-sm md:text-lg mb-4 drop-shadow-sm line-clamp-2 md:line-clamp-none">
                        {slide.subtitle}
                      </p>
                    )}

                    {slide.ctaText && slide.ctaLink && (
                      <Link
                        to={slide.ctaLink}
                        className="inline-block px-4 py-2 md:px-6 md:py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm md:text-base font-medium rounded-lg transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {slide.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {showManageModal && <ManageHeroModal slides={slides} onClose={() => setShowManageModal(false)} />}

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
        @media (max-width: 768px) {
          .swiper-button-next, .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
