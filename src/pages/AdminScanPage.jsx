import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminScanPage = () => {
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    const [scannedData, setScannedData] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Initialize Scanner when component mounts and isScanning is true
        if (isScanning) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: {width: 250, height: 250},
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                    videoConstraints: { facingMode: "environment" }
                },
                /* verbose= */ false
            );

            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        // Cleanup function
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScanning]);

    const onScanFailure = (error) => {
        // Just ignore scan failures (it happens every frame when no QR is found)
    };

    const onScanSuccess = async (decodedText, decodedResult) => {
        if (processing) return;
        setProcessing(true);
        setIsScanning(false);
        setScannedData(decodedText);

        // Pause scanner
        if (scannerRef.current) {
            scannerRef.current.clear().catch(e => console.error(e));
        }

        // We expect the QR code to be a URL from DigitalCard, e.g.,
        // https://karangtaruna.app/#/members/{UID} or similar containing UID/NIA
        // Let's try to extract a UID or NIA from the decoded text

        let uid = null;
        let nia = null;

        try {
            // Case 1: It's a full URL containing /members/UID
            if (decodedText.includes('/members/')) {
                const parts = decodedText.split('/members/');
                if (parts.length > 1) {
                    uid = parts[1].split('?')[0].split('#')[0].replace('/', '');
                }
            }
            // Case 2: It's a URL with uid or nia parameters
            else if (decodedText.includes('?')) {
                const url = new URL(decodedText.startsWith('http') ? decodedText : `http://localhost/${decodedText}`);
                uid = url.searchParams.get('uid');
                nia = url.searchParams.get('nia');
            }
            // Case 3: It's just raw text (maybe raw UID or raw NIA)
            else {
                if (decodedText.startsWith('KT-')) {
                    nia = decodedText;
                } else if (decodedText.length > 20) { // arbitrary length for typical firebase uid
                    uid = decodedText;
                }
            }
        } catch(e) {
             console.warn("Failed to parse QR text as URL", e);
             // Fallback assumption: it's raw text
             if (decodedText.startsWith('KT-')) nia = decodedText;
             else uid = decodedText;
        }

        await processAttendance(uid, nia, decodedText);
    };

    const processAttendance = async (uid, nia, rawData) => {
        try {
            let userData = null;
            let finalUid = uid;
            let finalNia = nia;

            // Find member
            if (uid) {
                const docSnap = await getDoc(doc(db, 'users', uid));
                if (docSnap.exists()) {
                    userData = { id: docSnap.id, ...docSnap.data() };
                    finalNia = userData.nia || userData.memberId || nia;
                }
            } else if (nia) {
                const q = query(collection(db, 'users'), where('nia', '==', nia));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    userData = { id: snap.docs[0].id, ...snap.docs[0].data() };
                    finalUid = userData.id;
                }
            }

            if (!userData) {
                toast.error("Anggota tidak ditemukan");
                setMemberInfo({ status: 'not_found', raw: rawData });
                setProcessing(false);
                return;
            }

            // Check if already checked in today
            const today = new Date().toISOString().split('T')[0];
            const attQ = query(
                collection(db, 'absensi'),
                where('uid', '==', finalUid),
                where('tanggal', '==', today)
            );
            const attSnap = await getDocs(attQ);

            if (!attSnap.empty) {
                toast.error("Anggota sudah absen hari ini.");
                setMemberInfo({
                    status: 'already_scanned',
                    name: userData.fullName || userData.displayName,
                    nia: finalNia,
                    time: attSnap.docs[0].data().waktu
                });
                setProcessing(false);
                return;
            }

            // Record attendance
            const time = new Date().toLocaleTimeString('id-ID');
            await addDoc(collection(db, 'absensi'), {
                uid: finalUid,
                nia: finalNia || 'UNKNOWN',
                nama: userData.fullName || userData.displayName,
                tanggal: today,
                waktu: time,
                ip_address: 'admin_scan',
                lokasi: 'admin_location',
                created_at: serverTimestamp(),
                method: 'admin_barcode_scan'
            });

            toast.success("Absensi berhasil!");
            setMemberInfo({
                status: 'success',
                name: userData.fullName || userData.displayName,
                nia: finalNia,
                time: time
            });

        } catch (error) {
            console.error("Error processing attendance:", error);
            toast.error("Terjadi kesalahan sistem");
            setMemberInfo({ status: 'error', raw: rawData });
        } finally {
            setProcessing(false);
        }
    };

    const handleRescan = () => {
        setMemberInfo(null);
        setScannedData(null);
        setIsScanning(true);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-6 relative font-display text-white">
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-8 pt-4">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold tracking-widest uppercase text-cyan-400">Scan Barcode</h1>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full relative z-10">

                {isScanning ? (
                    <div className="w-full flex flex-col items-center">
                        <div className="mb-4 flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest">Kamera Aktif</span>
                        </div>

                        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-800">
                             <div id="reader" className="w-full"></div>
                        </div>

                        <p className="text-sm text-slate-400 mt-6 text-center">
                            Arahkan kamera ke QR Code pada Kartu Anggota Digital untuk memverifikasi kehadiran.
                        </p>
                    </div>
                ) : (
                    <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center shadow-2xl">

                        {memberInfo?.status === 'success' && (
                            <div className="animate-fade-in-up">
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                    <span className="material-icons-round text-4xl">check_circle</span>
                                </div>
                                <h2 className="text-2xl font-black text-white mb-1">{memberInfo.name}</h2>
                                <p className="text-cyan-400 font-mono tracking-widest text-sm mb-4">{memberInfo.nia || 'NIA Tidak Tersedia'}</p>
                                <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                    <p className="text-xs text-emerald-400 font-bold uppercase">Absensi Berhasil</p>
                                    <p className="text-[10px] text-emerald-300/70">{new Date().toLocaleDateString('id-ID')} • {memberInfo.time}</p>
                                </div>
                            </div>
                        )}

                        {memberInfo?.status === 'already_scanned' && (
                            <div className="animate-fade-in-up">
                                <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/50">
                                    <span className="material-icons-round text-4xl">info</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">{memberInfo.name}</h2>
                                <p className="text-amber-400 text-sm mb-4">Sudah Melakukan Absensi</p>
                                <p className="text-xs text-slate-400">Anggota ini telah tercatat hadir pada pukul {memberInfo.time}. Tidak dapat absen dua kali di hari yang sama.</p>
                            </div>
                        )}

                        {memberInfo?.status === 'not_found' && (
                            <div className="animate-fade-in-up">
                                <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
                                    <span className="material-icons-round text-4xl">error_outline</span>
                                </div>
                                <h2 className="text-xl font-bold text-red-400 mb-2">Anggota Tidak Ditemukan</h2>
                                <p className="text-xs text-slate-400 break-all bg-black/30 p-2 rounded">Data scan: {memberInfo.raw}</p>
                            </div>
                        )}

                        {memberInfo?.status === 'error' && (
                            <div className="animate-fade-in-up">
                                <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
                                    <span className="material-icons-round text-4xl">warning</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h2>
                                <p className="text-xs text-slate-400">Sistem gagal memproses data QR Code.</p>
                            </div>
                        )}

                        <button
                            onClick={handleRescan}
                            className="mt-8 w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold tracking-widest uppercase border border-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-icons-round">qr_code_scanner</span>
                            Scan Ulang
                        </button>
                    </div>
                )}
            </div>

            {/* Custom Styles for Html5QrcodeScanner */}
            <style dangerouslySetInnerHTML={{__html: `
                #reader { border: none !important; }
                #reader__scan_region { background: #0f172a; }
                #reader__scan_region img { object-fit: cover; }
                #reader__dashboard_section_csr span { display: none; }
                #reader__dashboard_section_csr button {
                    background: #22d3ee; color: #0f172a; font-weight: bold; border: none; padding: 8px 16px; border-radius: 8px; margin-top: 10px; cursor: pointer;
                }
                #reader a { color: #22d3ee; text-decoration: none; }
            `}} />
        </div>
    );
};

export default AdminScanPage;
