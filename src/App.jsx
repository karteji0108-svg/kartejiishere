import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RamadanDecorations from './components/common/RamadanDecorations';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import InstallPrompt from './components/common/InstallPrompt';
import WhatsNewModal from './components/common/WhatsNewModal';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MemberList = lazy(() => import('./pages/MemberList'));
const AddMember = lazy(() => import('./pages/AddMember'));
const Finance = lazy(() => import('./pages/Finance'));
const AddTransaction = lazy(() => import('./pages/AddTransaction'));
const Activities = lazy(() => import('./pages/Activities'));
const CreateActivity = lazy(() => import('./pages/CreateActivity'));
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'));
const ActivityGallery = lazy(() => import('./pages/ActivityGallery'));
const Gallery = lazy(() => import('./pages/Gallery'));
const AddGalleryPhoto = lazy(() => import('./pages/AddGalleryPhoto'));
const Announcements = lazy(() => import('./pages/Announcements'));
const CreateAnnouncement = lazy(() => import('./pages/CreateAnnouncement'));
const Profile = lazy(() => import('./pages/Profile'));

// Simple loading spinner for Suspense fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
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
                background: '#10B981', // Emerald 500
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444', // Red 500
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
          }}
        />
        <RamadanDecorations />
        <InstallPrompt />
        <WhatsNewModal />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Authenticated Users) */}
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
            </Route>

            {/* Role Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/members" element={<MemberList />} />
              <Route path="/anggota" element={<MemberList />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/keuangan" element={<Finance />} />
            </Route>

            {/* Admin/Officer Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'ketua', 'sekretaris', 'admin', 'bendahara', 'anggota']} />}>
              <Route path="/members/add" element={<AddMember />} />
              <Route path="/announcements/create" element={<CreateAnnouncement />} />
              <Route path="/activities/create" element={<CreateActivity />} />
              <Route path="/finance/add" element={<AddTransaction />} />
              <Route path="/gallery/add" element={<AddGalleryPhoto />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
