import re

with open('src/pages/Finance.jsx', 'r') as f:
    content = f.read()

# Replace Top Summary Widget with an improved one that includes a bar chart
old_summary_widget = """        {/* Top Summary Widget */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <span className="material-icons-round text-2xl">account_balance_wallet</span>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Saldo Kas</p>
                    {loading ? <Skeleton className="h-8 w-40 mt-1" /> : (
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(summary.balance)}
                        </h2>
                    )}
                </div>
            </div>

            <div className="flex gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:pl-8">
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="material-icons-round text-[14px] text-emerald-500">trending_up</span> Pemasukan
                    </p>
                    {loading ? <Skeleton className="h-6 w-24" /> : (
                        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(summary.income)}
                        </h3>
                    )}
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="material-icons-round text-[14px] text-rose-500">trending_down</span> Pengeluaran
                    </p>
                    {loading ? <Skeleton className="h-6 w-24" /> : (
                        <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                            {formatCurrency(summary.expense)}
                        </h3>
                    )}
                </div>
            </div>
        </div>"""

new_summary_widget = """        {/* Top Summary Widget - Enhanced */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                        <span className="material-icons-round text-3xl">account_balance_wallet</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Saldo Kas</p>
                        {loading ? <Skeleton className="h-8 w-40" /> : (
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {formatCurrency(summary.balance)}
                            </h2>
                        )}
                    </div>
                </div>

                <div className="flex gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-4 md:pt-0 md:pl-8">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <span className="material-icons-round text-[14px] text-emerald-500">trending_up</span> Pemasukan
                        </p>
                        {loading ? <Skeleton className="h-6 w-24" /> : (
                            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(summary.income)}
                            </h3>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <span className="material-icons-round text-[14px] text-rose-500">trending_down</span> Pengeluaran
                        </p>
                        {loading ? <Skeleton className="h-6 w-24" /> : (
                            <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">
                                {formatCurrency(summary.expense)}
                            </h3>
                        )}
                    </div>
                </div>
            </div>

            {/* Visual Bar Chart */}
            {!loading && summary.income + summary.expense > 0 && (
                <div className="w-full mt-2">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1 px-1">
                        <span>Pemasukan ({Math.round((summary.income / (summary.income + summary.expense)) * 100)}%)</span>
                        <span>Pengeluaran ({Math.round((summary.expense / (summary.income + summary.expense)) * 100)}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full flex overflow-hidden bg-slate-100 dark:bg-slate-700">
                        <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${(summary.income / (summary.income + summary.expense)) * 100}%` }}
                        ></div>
                        <div
                            className="h-full bg-rose-500"
                            style={{ width: `${(summary.expense / (summary.income + summary.expense)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>"""

content = content.replace(old_summary_widget, new_summary_widget)

# Update transaction list styling
old_list = """                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">{trx.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {formatDate(trx.date)}
                                    </span>
                                    <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                                        {trx.category}
                                    </span>
                                    {trx.sourceFund && (
                                        <React.Fragment>
                                            <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                            <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                                                Kas {trx.sourceFund}
                                            </span>
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>"""

new_list = """                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate group-hover:text-primary transition-colors">{trx.title}</h4>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
                                        {formatDate(trx.date)}
                                    </span>
                                    <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded capitalize">
                                        {trx.category}
                                    </span>
                                    {trx.sourceFund && (
                                        <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded capitalize flex items-center gap-0.5">
                                            <span className="material-icons-round text-[10px]">account_balance</span> Kas {trx.sourceFund}
                                        </span>
                                    )}
                                </div>
                            </div>"""

content = content.replace(old_list, new_list)

with open('src/pages/Finance.jsx', 'w') as f:
    f.write(content)
