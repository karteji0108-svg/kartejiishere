import re

with open('src/components/members/DigitalCard.jsx', 'r') as f:
    content = f.read()

# Add useState to the import
if "useState" not in content:
    content = content.replace("import React, { useMemo } from 'react';", "import React, { useMemo, useState } from 'react';")
    content = content.replace("import React from 'react';", "import React, { useState } from 'react';")

# Add state variable inside the component
if "const [showQRModal, setShowQRModal] = useState(false);" not in content:
    content = content.replace("  const uid = member?.uid || member?.id;", "  const [showQRModal, setShowQRModal] = useState(false);\n  const uid = member?.uid || member?.id;")

# Make the QR image clickable
old_qr_img = '<img src={qrImageUrl} alt="QR Code Member" className="w-full h-full object-cover mix-blend-multiply" />'
new_qr_img = '<img src={qrImageUrl} alt="QR Code Member" className="w-full h-full object-cover mix-blend-multiply cursor-pointer" onClick={() => setShowQRModal(true)} />'
content = content.replace(old_qr_img, new_qr_img)

# Add the Modal at the end of the component return, right before the closing </div>
qr_modal = """
        {/* QR Code Fullscreen Modal */}
        {showQRModal && isQrActive && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-6" onClick={() => setShowQRModal(false)}>
                <div className="bg-white p-4 rounded-3xl shadow-2xl relative w-full max-w-[300px] animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setShowQRModal(false)} className="absolute -top-4 -right-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-slate-800 transition-colors">
                        <span className="material-icons-round">close</span>
                    </button>
                    <img src={qrImageUrl} alt="QR Code Enlarged" className="w-full h-auto object-contain rounded-xl" />
                    <p className="text-center text-slate-800 font-bold mt-4 tracking-widest">{memberId}</p>
                    <p className="text-center text-slate-500 text-xs mt-1">Gunakan untuk validasi kehadiran.</p>
                </div>
            </div>
        )}
"""

content = content.replace("    </div>\n  );\n};", f"{qr_modal}\n    </div>\n  );\n}};")

with open('src/components/members/DigitalCard.jsx', 'w') as f:
    f.write(content)
