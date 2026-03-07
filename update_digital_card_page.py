import re

with open('src/pages/DigitalCardPage.jsx', 'r') as f:
    content = f.read()

# Import necessary query functions
if "orderBy" not in content:
    content = content.replace("query, where, getDocs", "query, where, getDocs, orderBy")

# Update fetchData to get user index
old_fetch = """                // Fetch Profile
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile({ id: docSnap.id, ...docSnap.data() });
                }"""

new_fetch = """                // Fetch Profile
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                let userData = {};
                if (docSnap.exists()) {
                    userData = { id: docSnap.id, ...docSnap.data() };
                }

                // Get User Index for NIA Generation (Order by createdAt)
                try {
                    const usersQ = query(collection(db, 'users'), orderBy('createdAt', 'asc'));
                    const usersSnap = await getDocs(usersQ);
                    let index = 1;
                    usersSnap.forEach(uDoc => {
                        if (uDoc.id === currentUser.uid) {
                            userData.memberIndex = index;
                        }
                        index++;
                    });
                } catch(e) {
                    console.warn("Could not fetch user index", e);
                }

                setProfile(userData);"""

content = content.replace(old_fetch, new_fetch)

with open('src/pages/DigitalCardPage.jsx', 'w') as f:
    f.write(content)
