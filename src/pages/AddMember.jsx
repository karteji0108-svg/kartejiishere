import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddMember = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate save
    alert('Anggota baru berhasil ditambahkan!');
    navigate('/members');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen shadow-2xl relative flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 px-5 pt-4 pb-4 sticky top-0 z-40 shadow-sm flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Tambah Anggota</h1>
        </header>

        {/* Main Form */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Photo Upload Section */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary transition-colors">
                  <span className="material-icons-round text-3xl text-gray-400 group-hover:text-primary">add_a_photo</span>
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-sm">
                  <span className="material-icons-round text-xs">edit</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Upload Foto Profil</p>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="fullName">
                  Nama Lengkap
                </label>
                <input
                  className="block w-full px-4 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                  id="fullName"
                  name="fullName"
                  placeholder="Contoh: Budi Santoso"
                  type="text"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="nik">
                  NIK (Nomor Induk Kependudukan)
                </label>
                <input
                  className="block w-full px-4 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                  id="nik"
                  name="nik"
                  placeholder="16 digit angka"
                  type="number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  className="block w-full px-4 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                  id="email"
                  name="email"
                  placeholder="email@contoh.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="phone">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm font-medium">+62</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                    id="phone"
                    name="phone"
                    placeholder="812-3456-7890"
                    type="tel"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Organization Info */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Informasi Organisasi</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="role">
                    Jabatan
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full pl-4 pr-10 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm appearance-none"
                      id="role"
                      name="role"
                    >
                      <option value="Anggota">Anggota</option>
                      <option value="Ketua">Ketua</option>
                      <option value="Wakil Ketua">Wakil Ketua</option>
                      <option value="Sekretaris">Sekretaris</option>
                      <option value="Bendahara">Bendahara</option>
                      <option value="Humas">Humas</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <span className="material-icons-round text-gray-400">expand_more</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1" htmlFor="status">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full pl-4 pr-10 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm appearance-none"
                      id="status"
                      name="status"
                    >
                      <option value="Active">Aktif</option>
                      <option value="Inactive">Tidak Aktif</option>
                      <option value="Pending">Menunggu</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <span className="material-icons-round text-gray-400">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform active:scale-[0.98]"
              >
                Simpan Anggota Baru
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
};

export default AddMember;
