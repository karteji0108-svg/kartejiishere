import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { ROLES, hasPermission, PERMISSIONS } from '../constants/roles';
import Skeleton from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMember({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Anggota tidak ditemukan");
          navigate('/members');
        }
      } catch (error) {
        console.error("Error fetching member:", error);
        toast.error("Gagal memuat detail anggota");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id, navigate]);

  const canManageRoles = hasPermission(userRole, PERMISSIONS.MANAGE_ROLES);

  // Constraints Logic
  const canChangeRoleForTarget = (targetRole) => {
      if (!canManageRoles) return false;
      if (!targetRole) return true; // Can set if no role

      const target = targetRole.toLowerCase();
      const current = userRole.toLowerCase();

      if (current === ROLES.SUPER_ADMIN) return true; // Super Admin can do anything (usually)

      if (current === ROLES.KETUA) {
          // Ketua cannot change Super Admin or Wakil Ketua
          if (target === ROLES.SUPER_ADMIN) return false;
          if (target === ROLES.WAKIL_KETUA) return false;
          return true;
      }

      if (current === ROLES.WAKIL_KETUA) {
          // Wakil cannot change Super Admin or Ketua
          if (target === ROLES.SUPER_ADMIN) return false;
          if (target === ROLES.KETUA) return false;
          return true;
      }

      return false;
  };

  const checkRoleUniqueness = async (newRole) => {
      const restrictedRoles = [ROLES.SUPER_ADMIN, ROLES.KETUA, ROLES.WAKIL_KETUA];

      // Special Check for Content Creator Limit
      if (newRole === ROLES.CONTENT_CREATOR) {
          const q = query(collection(db, 'users'), where('role', '==', ROLES.CONTENT_CREATOR));
          const snapshot = await getDocs(q);

          let count = snapshot.size;
          const isAlreadyRole = member.role === ROLES.CONTENT_CREATOR;

          if (!isAlreadyRole && count >= 4) {
              toast.error("Maksimal 4 Content Creator tercapai.");
              return false;
          }
          return true;
      }

      if (!restrictedRoles.includes(newRole)) return true;

      // Query to check if anyone else has this role (for single-holder roles)
      const q = query(collection(db, 'users'), where('role', '==', newRole));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
          // Check if the existing user is NOT the current user being edited
          const existingUser = snapshot.docs.find(doc => doc.id !== id);
          if (existingUser) {
              const userData = existingUser.data();
              const name = userData.fullName || userData.displayName || 'pengguna lain';
              toast.error(`Role ${newRole.replace('_', ' ').toUpperCase()} sudah dipegang oleh ${name}.`);
              return false;
          }
      }
      return true;
  };

  const handleRoleChange = async (e) => {
      const newRole = e.target.value;

      // Verify permissions again for the NEW role
      if (!canChangeRoleForTarget(newRole)) {
          toast.error("Anda tidak memiliki izin untuk mengubah ke role ini.");
          return;
      }

      // Verify uniqueness and limits
      const isAllowed = await checkRoleUniqueness(newRole);
      if (!isAllowed) return;

      if (!confirm(`Apakah Anda yakin ingin mengubah role menjadi ${newRole.replace('_', ' ')}?`)) {
          return;
      }

      setUpdatingRole(true);
      try {
          await updateDoc(doc(db, 'users', id), {
              role: newRole
          });
          setMember(prev => ({ ...prev, role: newRole }));
          toast.success("Role berhasil diperbarui.");
      } catch (error) {
          console.error("Error updating role:", error);
          toast.error("Gagal memperbarui role.");
      } finally {
          setUpdatingRole(false);
      }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    try {
        if (timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return new Date(timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return '-'; }
  };

  if (loading) return (
      <div className="min-h-screen p-5 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-60 w-full rounded-xl" />
      </div>
  );

  if (!member) return null;

  return (
    <div className={`min-h-screen font-display flex flex-col relative transition-colors duration-500 overflow-hidden
      bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100`}>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-0"></div>

      <header className="px-4 py-4 flex items-center gap-4 sticky top-0 z-20 animate-fade-in-down safe-area-top">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors text-white">
          <span className="material-icons-round">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-white drop-shadow-md">Detail Anggota</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10 px-5 relative z-10 -mt-4 pt-10">
          <div className="flex flex-col items-center mb-6">
             <div className="w-28 h-28 rounded-full p-1 card flex items-center justify-center relative overflow-hidden mb-4 shadow-xl">
                <img
                    src={member.photoURL || `https://ui-avatars.com/api/?name=${member.displayName || 'User'}&background=random`}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                />
             </div>
             <h2 className="text-2xl font-bold mb-1 text-center">{member.fullName || member.displayName || 'Tanpa Nama'}</h2>
             <p className="opacity-80 mb-2">{member.email}</p>
             <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md
                ${member.role === ROLES.SUPER_ADMIN ? 'bg-red-500/20 border-red-500 text-red-500' :
                  member.role === ROLES.KETUA ? 'bg-blue-500/20 border-blue-500 text-blue-500' :
                  'bg-primary/20 border-primary text-primary'}`}>
                 {member.role?.replace('_', ' ') || 'ANGGOTA'}
             </span>
          </div>

          <div className="space-y-4">
              {/* Role Management Card */}
              {canManageRoles && canChangeRoleForTarget(member.role) && (
                  <div className="card p-5 border-l-4 border-yellow-500">
                      <h3 className="font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="material-icons-round text-yellow-500">admin_panel_settings</span>
                          Manajemen Role
                      </h3>
                      <p className="text-xs opacity-70 mb-3">Ubah hak akses pengguna ini.</p>

                      <select
                        value={member.role || ROLES.ANGGOTA}
                        onChange={handleRoleChange}
                        disabled={updatingRole}
                        className="input-field w-full p-3 font-semibold uppercase text-sm"
                      >
                          {/* Render options based on permissions */}
                          <option value={ROLES.ANGGOTA}>ANGGOTA</option>
                          <option value={ROLES.CONTENT_CREATOR}>CONTENT CREATOR</option>
                          <option value={ROLES.HUMAS}>HUMAS</option> {/* New Role */}
                          <option value={ROLES.SEKRETARIS}>SEKRETARIS</option>
                          <option value={ROLES.BENDAHARA}>BENDAHARA</option>

                          {/* Conditional Options */}
                          {(userRole === ROLES.SUPER_ADMIN || userRole === ROLES.KETUA) && (
                             <option value={ROLES.WAKIL_KETUA}>WAKIL KETUA</option>
                          )}

                          {(userRole === ROLES.SUPER_ADMIN) && (
                              <option value={ROLES.KETUA}>KETUA</option>
                          )}

                          {(userRole === ROLES.SUPER_ADMIN) && (
                              <option value={ROLES.SUPER_ADMIN}>SUPER ADMIN</option>
                          )}
                      </select>
                  </div>
              )}

              {/* Info Card */}
              <div className="card p-5 space-y-4">
                  <div>
                      <p className="text-xs opacity-60 uppercase font-bold mb-1">Bio</p>
                      <p className="text-sm italic opacity-90">"{member.bio || 'Belum ada bio'}"</p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                      <p className="text-xs opacity-60 uppercase font-bold mb-1">Kontak</p>
                      <p className="text-sm font-medium">{member.phone || '-'}</p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                      <p className="text-xs opacity-60 uppercase font-bold mb-1">Alamat</p>
                      <p className="text-sm font-medium">{member.address || '-'}</p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                      <p className="text-xs opacity-60 uppercase font-bold mb-1">Bergabung</p>
                      <p className="text-sm font-medium">{formatDate(member.createdAt)}</p>
                  </div>
              </div>
          </div>
      </main>
    </div>
  );
};

export default MemberDetail;
