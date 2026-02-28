const fs = require('fs');
let code = fs.readFileSync('src/pages/Finance.jsx', 'utf8');

code = code.replace(
/                        <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400">\n                            \{formatCurrency\(summary.expense\)\}\n                        <\/h3>\n                    \)\}\n          <\/div>\n                <\/div>\n            <\/div>\n        <\/div>/g,
`                        <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                            {formatCurrency(summary.expense)}
                        </h3>
                    )}
                </div>
            </div>
        </div>`
);

code = code.replace(
/                        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">\n                            \{formatCurrency\(summary.income\)\}\n                        <\/h3>\n                    \)\}\n          <\/div>\n                <\/div>/g,
`                        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(summary.income)}
                        </h3>
                    )}
                </div>`
);

code = code.replace(
/                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">\n                            \{formatCurrency\(summary.balance\)\}\n                        <\/h2>\n                    \)\}\n          <\/div>\n                <\/div>\n            <\/div>/g,
`                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(summary.balance)}
                        </h2>
                    )}
                </div>
            </div>`
);

fs.writeFileSync('src/pages/Finance.jsx', code);
