import re

with open("src/pages/Dashboard.jsx", "r") as f:
    content = f.read()

search = r'(<section className="grid grid-cols-2 md:grid-cols-4 gap-4">.*?<\/section>)'
replace = r'\1\n\n        {canViewFinance && (\n          <section className="mt-6">\n            <FinanceChart />\n          </section>\n        )}'

content = re.sub(search, replace, content, flags=re.DOTALL)

with open("src/pages/Dashboard.jsx", "w") as f:
    f.write(content)
