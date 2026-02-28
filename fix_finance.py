with open('src/pages/Finance.jsx', 'r') as f:
    content = f.read()

content = content.replace("const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });", "const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0, categories: {} });")

calc_old = """        let inc = 0, exp = 0;
        allSnap.forEach(doc => {
            const d = doc.data();
            const amt = typeof d.amount === 'string' ? parseFloat(d.amount.replace(/[^\\d.-]/g, '')) : d.amount;
            if (d.type === 'income') inc += amt;
            else if (d.type === 'expense') exp += amt;
        });
        setSummary({
            income: inc,
            expense: exp,
            balance: inc - exp
        });"""

calc_new = """        let inc = 0, exp = 0;
        let cats = {};
        allSnap.forEach(doc => {
            const d = doc.data();
            const amt = typeof d.amount === 'string' ? parseFloat(d.amount.replace(/[^\\d.-]/g, '')) : d.amount;
            if (d.type === 'income') {
                inc += amt;
            } else if (d.type === 'expense') {
                exp += amt;
            }
            if (d.category) {
                if (!cats[d.category]) cats[d.category] = { income: 0, expense: 0 };
                cats[d.category][d.type] += amt;
            }
        });
        setSummary({
            income: inc,
            expense: exp,
            balance: inc - exp,
            categories: cats
        });"""

content = content.replace(calc_old, calc_new)

ui_addition = """
            </div>
        </div>

        {/* Separated Category Balances */}
        <div>
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-black text-xl text-gray-900 dark:text-white">Rincian Saldo per Kategori</h3>
            </div>
            {loading ? (
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-24 w-full rounded-[1.5rem]" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(summary.categories || {})
                        .map(([cat, data]) => {
                            const bal = data.income - data.expense;
                            if (bal === 0) return null;
                            return (
                                <div key={cat} className="bg-white dark:bg-surface-dark rounded-[1.5rem] p-4 border-2 border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 line-clamp-1">{cat}</p>
                                    <h3 className={`text-lg font-black tracking-tight ${bal >= 0 ? 'text-success-700 dark:text-success-400' : 'text-danger-700 dark:text-danger-400'}`}>
                                        {formatCurrency(bal)}
                                    </h3>
                                </div>
                            );
                        })
                    }
                </div>
            )}
        </div>

        {/* Transactions List"""

content = content.replace("            </div>\n        </div>\n\n        {/* Transactions List", ui_addition)

with open('src/pages/Finance.jsx', 'w') as f:
    f.write(content)
