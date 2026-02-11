import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import AddMember from './pages/AddMember';
import Finance from './pages/Finance';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import ActivityGallery from './pages/ActivityGallery';
import Announcements from './pages/Announcements';
import CreateAnnouncement from './pages/CreateAnnouncement';
import Profile from './pages/Profile';
import RamadanDecorations from './components/RamadanDecorations';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <RamadanDecorations />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Authenticated Users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<Profile />} /> {/* Assuming /profil is the translated route for Profile */}
          <Route path="/profile" element={<Profile />} />

          <Route path="/activities" element={<Activities />} />
          <Route path="/kegiatan" element={<Activities />} />

          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/gallery" element={<ActivityGallery />} />

          <Route path="/announcements" element={<Announcements />} />
          <Route path="/pengumuman" element={<Announcements />} />
        </Route>

        {/* Role Protected Routes */}
        {/* Example: Only specific roles can add members or see full member list details */}
        {/* Assuming 'anggota' can view member list but maybe not add? For now, let's keep it simple as per prompt structure */}
        <Route element={<ProtectedRoute />}>
           <Route path="/members" element={<MemberList />} />
           <Route path="/anggota" element={<MemberList />} />
           <Route path="/finance" element={<Finance />} />
           <Route path="/keuangan" element={<Finance />} />
        </Route>

        {/* Admin/Officer Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['super_admin', 'ketua', 'sekretaris', 'admin']} />}>
          <Route path="/members/add" element={<AddMember />} />
          <Route path="/announcements/create" element={<CreateAnnouncement />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
