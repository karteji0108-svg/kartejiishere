import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { formatDate } from '../utils/date';
import Skeleton from '../components/common/Skeleton';
import BottomNav from '../components/layout/BottomNav';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const docRef = doc(db, 'announcements', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAnnouncement({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
          });
        } else {
          setAnnouncement(null);
        }
      } catch (error) {
        console.error("Error fetching announcement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  // Utility to convert URLs to clickable links and handle newlines
  const formatContent = (text) => {
    if (!text) return null;

    // Split by newlines first to handle paragraphs
    return text.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) return <br key={index} />;

      // Regex to find URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = paragraph.split(urlRegex);

      return (
        <p key={index} className="mb-2 last:mb-0">
          {parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline break-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-display">
         <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
             <div className="h-6 w-32 rounded-lg bg-gray-200 animate-pulse"></div>
         </div>
         <div className="p-6">
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                 <div className="flex gap-4 items-start">
                     <Skeleton className="w-12 h-12 rounded-2xl" />
                     <div className="flex-1 space-y-2">
                         <Skeleton className="h-6 w-3/4 rounded" />
                         <Skeleton className="h-4 w-1/4 rounded" />
                     </div>
                 </div>
                 <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                     <Skeleton className="h-4 w-full rounded" />
                     <Skeleton className="h-4 w-full rounded" />
                     <Skeleton className="h-4 w-2/3 rounded" />
                 </div>
             </div>
         </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-display">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <span className="material-icons-round text-gray-400 text-4xl">search_off</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Pengumuman yang Anda cari mungkin telah dihapus.</p>
          <button
            onClick={() => navigate('/announcements')}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          >
            Kembali
          </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-display">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors active:scale-90"
        >
          <span className="material-icons-round text-gray-600 dark:text-gray-300">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">Detail Pengumuman</h1>
      </div>

      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">

            {/* Header Content */}
            <div className="flex gap-4 items-start border-b border-gray-100 dark:border-gray-700 pb-5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons-round text-2xl">campaign</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                        {announcement.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                            <span className="material-icons-round text-sm">event</span>
                            <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Body Content */}
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                {formatContent(announcement.content)}
            </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AnnouncementDetail;
