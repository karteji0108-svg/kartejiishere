import os

files_to_check = [
    'src/pages/AddTransaction.jsx',
    'src/pages/Finance.jsx'
]

for file_path in files_to_check:
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        exit(1)

# Check AddTransaction
with open('src/pages/AddTransaction.jsx', 'r') as f:
    content = f.read()
    if 'uploadToCloudinary' not in content:
        print("Failed: uploadToCloudinary import missing in AddTransaction.jsx")
        exit(1)
    if 'setReceiptImage' not in content:
        print("Failed: setReceiptImage state missing in AddTransaction.jsx")
        exit(1)
    if 'receiptUrl:' not in content:
        print("Failed: receiptUrl field missing in Firestore payload in AddTransaction.jsx")
        exit(1)

# Check Finance
with open('src/pages/Finance.jsx', 'r') as f:
    content = f.read()
    if 't.receiptUrl' not in content:
        print("Failed: receiptUrl check missing in Finance.jsx list")
        exit(1)
    if 'setSelectedReceipt' not in content:
        print("Failed: Modal state setter missing in Finance.jsx")
        exit(1)

print("Static verification passed: Receipt upload logic looks correct.")
