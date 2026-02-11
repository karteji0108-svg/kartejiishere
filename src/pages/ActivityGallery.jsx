import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActivityGallery = () => {
  const navigate = useNavigate();

  const photos = [
    { id: 1, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASy66xcZSwNkxy2SHzPIGF0WyTcwUM1u9NMutAmqoU27cbo76c99aPz66bsU2JXx0rJ2JI85fjWqogTE3Mt_hf39-FHza1AQXUGG2-2mlLoS3n6-PDOjBThDG_kNPWDhWaIbiohI9I5hytmXRWgsVgZdmCZjpzqnUMQGC3P00e_beYu6ZQ76Kh5Y9ixmU9WrZ83YqyB2tI1RoGzNTXQYZvleubGK8oSacpB2BlFXQDuKdnKkSFZlby0yuPBCT6_f2HDmNtlV15wQg', title: 'Bersih Desa', date: '12 Okt 2023' },
    { id: 2, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe1Hx9gknNK_rE6_74DC6lxR0zCkEbG_qyrKC-dgG3npg-nib5-aQWoQaQ9dP51l-YIqg2kXm1ZKa9c2ftgJt8VRO_-kWCfkb7wrWvvYIkv_8y0YkHapvdgOYfqSWEn9xsI6lL4ZM-MoQDCZFmREf7l4G1uF_8LjQraRIVfsAHAy8pStmTM28il3cAMxJ2RjtqB8e6JYzIUTBRxUjag6OqRb6vRNZA3CS0V0jOFP-4Xb_2BhyWsykVtJ3Cxf6lJnrg-Z6aWI9KOQU', title: 'Badminton', date: '20 Okt 2023' },
    { id: 3, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNdHYD50mziqeXJHp6_YtnGaH46GCL3fL7CIM0UL-urKCbwh4_53OGE84M-fyPn5p9lzCOq4LZsuy5y_nEOTx-0ntJB6qypZvFQJA3Im3ChN3AeJZgeL43MRMsgpG9Q46Uh8RK1w26_l7pxp5kDOgPThWea2sgDClj5_fh_93_KKz-yI-5MUnIn50ikmikqxtXA9RDE3dYCLAEzBLkMDy30EOu1QV3DL1m5BUiLX91ExSRnZdx9AEpNn6VKD1jI1h6r1ACNu5LBlg', title: 'Workshop', date: '5 Okt 2023' },
    { id: 4, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-su39Htc4wi3TEewyRyPHSAqUFOG3GpB2xCageLYkYvMgZG5tM2dYwAXhVxKLEpWpMX1Zw7JvNeZRCA00kptWVYJKM6m7HbPr6vUcTQOAfM7WLd6xk4pFbDIuoBZkZn9-Qi_xYHAM6Fx0Fq5gb9BSrV6iyE9S-_rU9ZZVqTx9nhUwqsoLMKizjmQ6un-qrBVHInm_NCdIn9eNxLqsgGAKOUNlPUhmXyclEAfe1IfK7SvzDBIxq4yzV8aAjFJeFGCEeIaWVrPcNlo', title: 'Rapat', date: '15 Okt 2023' },
    { id: 5, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGlip_hsHfVSq2GEr5UByG96gWjOb1FlVCGxsoYz1y8ZA6iLke_IZhQXZK1q2cnd5tUuP3Mqmf_SZBdooKqfbHmvGIV_gpXB-kp8Ocj4XyjibEXfY3oFRu4VQcWERauVHyjBx7cNPLnF_f0Q5Tq9Hj_u63aBw6ZzWzXtqQBwWtyYoi862xLQZlK92KPjZHUyvPkwCUDeWb6urmoqe6UiB7jlV8Pu_dZHOSy4dLvOdG01lcorb0tEkk-VrybxD-FZtrc_O6WVpllGQ', title: 'Pelatihan', date: '25 Sep 2023' },
    { id: 6, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjm5f4RqhBykSoW0Xwr0MrocJTt7OD2XXsDC8zRWbKMI47ZkWya2BIaK5xIdv44DQmppllbYP4z-Es8Si8msdl7uunO6uWVHIZpmg-KLQMs3WsYHVX3MDVZpiAEq6s7TWd00K8cW3Qj_W-Hydsd_wOkyQ4XBF3OuMsYOY4bLOe0jFdPQsIkZG8UqnS_jW98G2D2UEWzB_Ww2sLHf49slkHU7cqQy0k7fv8jBNGZZE-5k_uIQsDRGHGF6qKEt5eQ4H2uje39BmNhpA', title: 'Kunjungan', date: '20 Sep 2023' },
  ];

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
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Galeri Kegiatan</h1>
        </header>

        {/* Gallery Grid */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-1 pb-24">
          <div className="grid grid-cols-2 gap-1">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square group cursor-pointer overflow-hidden">
                <img
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  src={photo.src}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white font-semibold text-sm truncate">{photo.title}</p>
                  <p className="text-gray-300 text-xs">{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityGallery;
