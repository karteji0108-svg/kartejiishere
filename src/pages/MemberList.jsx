import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';

const initialMembers = [
  {
    id: 1,
    name: 'Budi Santoso',
    role: 'Ketua',
    phone: '0812-3456-7890',
    status: 'active',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEFdVRsisJkPdWpjT-_rIPPlRZLFDUd1pd_-7OG2CE3qCcGNoSOS2zmOF5XydoYQFAEn6dtJlcHMTsWvKI64ZX-ssoMKsYTrT1yDxg8XD66FvgFVybvShDXU5UkDc30scQaUtmR5dwSDgBTYajlkmtMlJwNR8ooMhDb5wZRMRDBsD3DTWnJSQXvrpJy0W30mzlkiu61kw_pdK1bNq5k2lkJVothQ_iGzQFRfhIer2NjdLMMpA9XoGyogskiShr7u8S55cXlnkezi4',
    roleColor: 'bg-primary/10 text-primary',
    isCore: true,
  },
  {
    id: 2,
    name: 'Siti Aminah',
    role: 'Sekretaris',
    phone: '0813-5555-0192',
    status: 'active',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbqnk1LMlcnLl7tJFFnCxxK3rUOuTD14Mcr9rGOIMKCNP4nHYPPwOwURyPh-GJ_0z8y4upl_KXJSJ_St1nty-Fng1N5k1mQ1gIGpD2EKoGZcMCu_WwLLrEzO4Bs30dRX5ixCy0zAK2_SHH8jV8zypH5cem0-Odm1hHpso84QcPuShlcUcv9dyUrEYZbOU-2CyYT4KLWN8YN4R3AXksySG9h-ojYg3d1yQJ-z7xr1fkZmeMijD123VXy6an21MRy8BrWgzQDJvRlC0',
    roleColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    isCore: true,
  },
  {
    id: 3,
    name: 'Rizky Pratama',
    role: 'Bendahara',
    phone: '0856-7777-1234',
    status: 'active',
    initials: 'RP',
    avatarColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
    roleColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    isCore: true,
  },
  {
    id: 4,
    name: 'Ahmad Fauzi',
    role: 'Anggota',
    phone: 'Tidak Aktif',
    status: 'inactive',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMDtPHN6dGp57Kona1kYKTFnGGJq0OqWjZ0qFyKOgRWeXZcRe8yQoLeB--yk70dLTujGyvsfT2VWzq1DVGDf8xLrz0zCrRjm5hvzIjIUqQwp4iIV3VuWZ_uOxZeOLlKyqeRXARS9PGKTVzgBiqR6ZBO1YBP82cynsnK2wqSXqIAHNwZ_YN7fcIy4hDIQzsnWGnxw1DTMaXQtu-a-yXfTfow-NWCbCfy_clHEZql8Hy0gzWI9Yup9o1ulz1u-7pOS0mr6HSmvX--t4',
    roleColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    isCore: false,
  },
  {
    id: 5,
    name: 'Dimas Aditya',
    role: 'Anggota',
    phone: '0896-1122-3344',
    status: 'active',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGlip_hsHfVSq2GEr5UByG96gWjOb1FlVCGxsoYz1y8ZA6iLke_IZhQXZK1q2cnd5tUuP3Mqmf_SZBdooKqfbHmvGIV_gpXB-kp8Ocj4XyjibEXfY3oFRu4VQcWERauVHyjBx7cNPLnF_f0Q5Tq9Hj_u63aBw6ZzWzXtqQBwWtyYoi862xLQZlK92KPjZHUyvPkwCUDeWb6urmoqe6UiB7jlV8Pu_dZHOSy4dLvOdG01lcorb0tEkk-VrybxD-FZtrc_O6WVpllGQ',
    roleColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    isCore: false,
  },
  {
    id: 6,
    name: 'Rina Wati',
    role: 'Anggota',
    phone: '0821-4455-6677',
    status: 'active',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjm5f4RqhBykSoW0Xwr0MrocJTt7OD2XXsDC8zRWbKMI47ZkWya2BIaK5xIdv44DQmppllbYP4z-Es8Si8msdl7uunO6uWVHIZpmg-KLQMs3WsYHVX3MDVZpiAEq6s7TWd00K8cW3Qj_W-Hydsd_wOkyQ4XBF3OuMsYOY4bLOe0jFdPQsIkZG8UqnS_jW98G2D2UEWzB_Ww2sLHf49slkHU7cqQy0k7fv8jBNGZZE-5k_uIQsDRGHGF6qKEt5eQ4H2uje39BmNhpA',
    roleColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    isCore: false,
  },
  {
    id: 7,
    name: 'Fajar Kurniawan',
    role: 'Anggota',
    phone: '0812-9988-7766',
    status: 'active',
    initials: 'FK',
    avatarColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    roleColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    isCore: false,
  },
];

const MemberList = () => {
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const filteredMembers = initialMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                          member.role.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'Semua') return true;
    if (filter === 'Pengurus Inti') return member.isCore;
    if (filter === 'Anggota Aktif') return member.status === 'active';

    return true;
  });

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white h-screen flex flex-col overflow-hidden relative">
      {/* Top Status Bar Simulation (iOS) */}
      <div className="h-12 w-full bg-white dark:bg-gray-900 flex items-center justify-between px-6 text-xs font-medium z-50 sticky top-0 shrink-0 border-b border-gray-100 dark:border-gray-800">
        <span className="w-12 text-center">9:41</span>
        <div className="flex space-x-2 items-center">
          <span className="material-icons text-[16px]">signal_cellular_alt</span>
          <span className="material-icons text-[16px]">wifi</span>
          <span className="material-icons text-[16px] rotate-180">battery_full</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        {/* Header Section */}
        <header className="bg-white dark:bg-gray-900 px-5 pt-4 pb-4 sticky top-0 z-40 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Daftar Anggota</h1>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-primary">
              <span className="material-icons">filter_list</span>
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-gray-400 text-xl">search</span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-800 transition duration-150 ease-in-out sm:text-sm"
              placeholder="Cari nama atau jabatan..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Quick Filter Chips */}
          <div className="flex space-x-2 mt-4 overflow-x-auto no-scrollbar">
            {['Semua', 'Pengurus Inti', 'Anggota Aktif'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* Member List */}
        <div className="px-5 py-4 space-y-3">
          {filteredMembers.map((member) => (
            <div key={member.id} className={`group relative bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer ${member.status === 'inactive' ? 'opacity-75' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {member.avatar ? (
                    <img
                      alt={`Portrait of ${member.name}`}
                      className={`h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm ${member.status === 'inactive' ? 'grayscale' : ''}`}
                      src={member.avatar}
                    />
                  ) : (
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg border-2 border-white dark:border-gray-800 shadow-sm ${member.avatarColor}`}>
                        {member.initials}
                    </div>
                  )}
                  <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${member.roleColor}`}>
                      {member.role}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{member.phone}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-primary transition-colors p-2 -mr-2">
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
          ))}
          {/* Spacing for last item if list is long */}
          <div className="h-24"></div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed right-5 bottom-24 bg-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40">
        <span className="material-icons">add</span>
      </button>

      <BottomNav />
    </div>
  );
};

export default MemberList;
