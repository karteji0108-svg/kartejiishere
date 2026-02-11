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

function App() {
  return (
    <Router>
      <RamadanDecorations />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<MemberList />} />
        <Route path="/members/add" element={<AddMember />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/gallery" element={<ActivityGallery />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/announcements/create" element={<CreateAnnouncement />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
