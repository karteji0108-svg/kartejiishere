import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import InstallPrompt from './components/common/InstallPrompt';
import WhatsNewModal from './components/common/WhatsNewModal';
import { getPlatform } from './utils/platform';
import { useAuth } from './context/AuthContext';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MemberList = lazy(() => import('./pages/MemberList'));
const MemberDetail = lazy(() => import('./pages/MemberDetail'));
const AddMember = lazy(() => import('./pages/AddMember'));
const Finance = lazy(() => import('./pages/Finance'));
const TransactionDetail = lazy(() => import('./pages/TransactionDetail'));
const AddTransaction = lazy(() => import('./pages/AddTransaction'));
const Activities = lazy(() => import('./pages/Activities'));
const CreateActivity = lazy(() => import('./pages/CreateActivity'));
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'));
const ActivityGallery = lazy(() => import('./pages/ActivityGallery'));
const Gallery = lazy(() => import('./pages/Gallery'));
const AddGalleryPhoto = lazy(() => import('./pages/AddGalleryPhoto'));
const Announcements = lazy(() => import('./pages/Announcements'));
const AnnouncementDetail = lazy(() => import('./pages/AnnouncementDetail')); // New Page
const CreateAnnouncement = lazy(() => import('./pages/CreateAnnouncement'));
const Profile = lazy(() => import('./pages/Profile'));
const UserApprovals = lazy(() => import('./pages/UserApprovals')); // New Page
const PendingApproval = lazy(() => import('./pages/PendingApproval')); // New Page
const AccountRejected = lazy(() => import('./pages/AccountRejected')); // New Page


// New Features
const Menu = lazy(() => import('./pages/Menu'));
const Correspondence = lazy(() => import('./pages/Correspondence'));
const AddCorrespondence = lazy(() => import('./pages/AddCorrespondence'));
const Inventory = lazy(() => import('./pages/Inventory'));
const AddInventory = lazy(() => import('./pages/AddInventory'));
const Partners = lazy(() => import('./pages/Partners'));
const AddPartner = lazy(() => import('./pages/AddPartner'));
const SocialMedia = lazy(() => import('./pages/SocialMedia'));

// Simple loading spinner for Suspense fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Simple Auth Wrapper for Status Pages (no status check to avoid loops)
const AuthOnly = ({ children }) => {
    const { currentUser, loading } = useAuth();
    if (loading) return <LoadingFallback />;
    if (!currentUser) return <Navigate to="/" replace />;
    return children;
};

function App() {
  useEffect(() => {
    const platform = getPlatform();
    document.body.classList.add(platform);
    return () => {
      document.body.classList.remove(platform);
    };
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#10B981',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
          }}
        />
        <InstallPrompt />
        <WhatsNewModal />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Status Routes (Authenticated but not fully authorized) */}
            <Route path="/pending" element={<AuthOnly><PendingApproval /></AuthOnly>} />
            <Route path="/rejected" element={<AuthOnly><AccountRejected /></AuthOnly>} />

            {/* Protected Routes (Authenticated & Approved Users) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/activities" element={<Activities />} />
              <Route path="/kegiatan" element={<Activities />} />

              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/gallery" element={<Gallery />} />

              <Route path="/announcements" element={<Announcements />} />
              <Route path="/pengumuman" element={<Announcements />} />
              <Route path="/announcements/:id" element={<AnnouncementDetail />} /> {/* New Route */}

              <Route path="/menu" element={<Menu />} />
              <Route path="/correspondence" element={<Correspondence />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/social-media" element={<SocialMedia />} />
            </Route>

            {/* Role Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/members" element={<MemberList />} />
              <Route path="/anggota" element={<MemberList />} />
              <Route path="/members/:id" element={<MemberDetail />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/keuangan" element={<Finance />} />
              <Route path="/finance/:id" element={<TransactionDetail />} />
            </Route>

            {/* Admin/Officer Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'ketua', 'sekretaris', 'admin', 'bendahara', 'wakil_ketua', 'anggota', 'content_creator', 'humas']} />}>
              <Route path="/members/add" element={<AddMember />} />
              <Route path="/announcements/create" element={<CreateAnnouncement />} />
              <Route path="/announcements/edit/:id" element={<CreateAnnouncement />} />
              <Route path="/activities/create" element={<CreateActivity />} />
              <Route path="/activities/edit/:id" element={<CreateActivity />} />
              <Route path="/finance/add" element={<AddTransaction />} />
              <Route path="/finance/edit/:id" element={<AddTransaction />} />
              <Route path="/gallery/add" element={<AddGalleryPhoto />} />


              {/* New Add Pages */}
              <Route path="/correspondence/add" element={<AddCorrespondence />} />
              <Route path="/inventory/add" element={<AddInventory />} />
              <Route path="/partners/add" element={<AddPartner />} />
            </Route>

            {/* User Approval Route (Super Admin, Ketua, Wakil Ketua) */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'ketua', 'wakil_ketua']} />}>
                 <Route path="/user-approvals" element={<UserApprovals />} />
            </Route>

          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
