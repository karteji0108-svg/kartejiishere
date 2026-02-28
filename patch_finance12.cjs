const fs = require('fs');
let code = fs.readFileSync('src/pages/Finance.jsx', 'utf8');

code = code.replace(
/                                        <\/React.Fragment>\n                                    \)\}\n          <\/div>\n                                <\/div>\n                            <\/div>/g,
`                                        </React.Fragment>
                                    )}
                                </div>
                            </div>`
);

code = code.replace(
/                    <\/div>\n                \)\}\n          <\/div>\n            <\/div>\n        <\/div>\n      <\/div>\n    <\/div>\n  \);\n\};\n\nexport default Finance;/g,
`                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;`
);

fs.writeFileSync('src/pages/Finance.jsx', code);
