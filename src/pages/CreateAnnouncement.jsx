import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Info');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate save
    alert('Pengumuman berhasil dibuat!');
    navigate('/announcements');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen shadow-2xl relative flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 px-5 pt-4 pb-4 sticky top-0 z-40 shadow-sm flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Buat Pengumuman</h1>
        </header>

        {/* Main Form */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="title">
                Judul Pengumuman
              </label>
              <input
                className="block w-full px-4 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                id="title"
                name="title"
                placeholder="Contoh: Rapat Rutin Bulanan"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                {['Penting', 'Kegiatan', 'Info', 'Rapat'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      category === cat
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/30'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="content">
                Isi Pengumuman
              </label>
              <textarea
                className="block w-full px-4 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm h-40 resize-none"
                id="content"
                name="content"
                placeholder="Tulis detail pengumuman di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Date Info (Auto-generated usually, but editable here for demo) */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-primary">event_available</span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tanggal Posting</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Hari Ini</p>
                </div>
              </div>
              <span className="text-xs text-primary font-medium">Ubah</span>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform active:scale-[0.98]"
              >
                Terbitkan Pengumuman
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
