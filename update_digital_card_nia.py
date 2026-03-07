import re

with open('src/components/members/DigitalCard.jsx', 'r') as f:
    content = f.read()

# Replace generateNIA logic
old_generate = """const generateNIA = (uid, joinDate) => {
    if (!uid) return 'KT-2024-000';
    let year = '2024';
    if (joinDate) {
        try {
            year = new Date(joinDate).getFullYear().toString();
        } catch(e) {}
    }
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash) % 1000;
    const paddedNum = num.toString().padStart(3, '0');
    return `KT-${year}-${paddedNum}`;
};"""

new_generate = """const generateNIA = (uid, joinDate, index) => {
    if (!uid) return 'KT-2024-000';
    let year = '2024';
    if (joinDate) {
        try {
            // handle both Date objects and strings
            const dateObj = typeof joinDate?.toDate === 'function' ? joinDate.toDate() : new Date(joinDate);
            if (!isNaN(dateObj)) year = dateObj.getFullYear().toString();
        } catch(e) {}
    }

    // If we have a specific index passed down, use it
    if (index !== undefined && index !== null) {
        const paddedNum = index.toString().padStart(3, '0');
        return `KT-${year}-${paddedNum}`;
    }

    // Fallback if index isn't available yet
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash) % 1000;
    const paddedNum = num.toString().padStart(3, '0');
    return `KT-${year}-${paddedNum}`;
};"""

content = content.replace(old_generate, new_generate)

# Update DigitalCard props to use index
old_member_id = "const memberId = member?.memberId || member?.nia || generateNIA(uid, member?.createdAt);"
new_member_id = "const memberId = member?.memberId || member?.nia || generateNIA(uid, member?.createdAt, member?.memberIndex);"

content = content.replace(old_member_id, new_member_id)

with open('src/components/members/DigitalCard.jsx', 'w') as f:
    f.write(content)
