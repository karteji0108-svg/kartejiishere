import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import AddMember from './pages/AddMember';
import Finance from './pages/Finance';
import Activities from './pages/Activities';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<MemberList />} />
        <Route path="/members/add" element={<AddMember />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
