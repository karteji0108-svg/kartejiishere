const fs = require('fs');

let financeCode = fs.readFileSync('src/pages/Finance.jsx', 'utf8');

const downloadFinanceCode = `
  const handleDownload = () => {
    if (transactions.length === 0) return;
    const headers = ['Tanggal', 'Judul', 'Tipe', 'Kategori', 'Sumber Dana', 'Jumlah'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date ? new Date(t.date).toLocaleDateString('id-ID') : '',
        \`"\${(t.title || '').replace(/"/g, '""')}"\`,
        t.type,
        t.category || '',
        t.sourceFund || '',
        typeof t.amount === 'string' ? t.amount.replace(/[^\\d.-]/g, '') : t.amount
      ].join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = \`Laporan_Keuangan_\${new Date().toISOString().split('T')[0]}.csv\`;
    link.click();
  };
`;

financeCode = financeCode.replace(
/  if \(!canView\) return null;/g,
`${downloadFinanceCode}\n  if (!canView) return null;`
);

financeCode = financeCode.replace(
/          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">/,
`<button onClick={() => navigate(-1)} className="mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">\n              <span className="material-icons-round text-xl">arrow_back</span>\n          </button>\n          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">`
);

financeCode = financeCode.replace(
/          \{canManage && \(/g,
`          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 flex items-center justify-center rounded-lg shadow-sm transition-colors duration-200 text-sm font-medium gap-2">
                <span className="material-icons-round text-lg">download</span> <span className="hidden sm:inline">Download</span>
            </button>
          {canManage && (`
);

financeCode = financeCode.replace(
/          \)}/g,
`          )}
          </div>`
);

fs.writeFileSync('src/pages/Finance.jsx', financeCode);
