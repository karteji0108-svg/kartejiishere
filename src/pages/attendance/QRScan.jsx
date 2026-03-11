import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

export default function QRScan() {
  const [scannedData, setScannedData] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleScan = async (data) => {
    if (data) {
      setScannedData(data);
      try {
        const attendanceRef = doc(db, 'attendance', `${data}_${currentUser.uid}`);
        await setDoc(attendanceRef, {
          activityId: data,
          memberId: currentUser.uid,
          memberName: currentUser.displayName,
          scannedAt: serverTimestamp(),
          status: 'hadir'
        });
        toast.success("Berhasil absen!");
        navigate(-1);
      } catch (error) {
        console.error("Error scanning QR:", error);
        toast.error("Gagal melakukan absensi.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-black text-center mb-6">Scan QR Kehadiran</h1>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
          {/* Placeholder for QR Scanner component */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <p className="text-sm">Arahkan kamera ke kode QR</p>
          </div>
          <div className="absolute inset-4 border-2 border-primary rounded-xl opacity-50 z-10 pointer-events-none"></div>
          {/* In a real implementation, you would use a library like html5-qrcode here */}
          {/* Example: <Html5QrcodeScanner ... /> */}
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Scan kode QR yang ditampilkan panitia untuk mencatat kehadiran Anda pada kegiatan ini.</p>
      </div>

      <button onClick={() => navigate(-1)} className="btn-secondary w-full py-3 rounded-2xl">
        Kembali
      </button>
    </div>
  );
}
