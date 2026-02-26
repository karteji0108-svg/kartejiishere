import React, { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { ROLES } from "../constants/roles";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, fullName) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Default role is ANGGOTA.
        // Status is PENDING.
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email,
            role: ROLES.ANGGOTA,
            status: "pending",
            createdAt: new Date().toISOString()
        });

        return user;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    fullName: user.displayName,
                    email: user.email,
                    role: ROLES.ANGGOTA, // Default role
                    status: "pending", // Default status for new Google users
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString()
                });
            }
            return user;
        } catch (error) {
            console.error("Google Sign-In Error", error);
            throw error;
        }
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                // Fetch user role and status from Firestore
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserRole(data.role || ROLES.ANGGOTA);
                        // Default to active if status is missing (legacy users)
                        setUserStatus(data.status || "active");
                    } else {
                        // Fallback if doc doesn't exist yet (race condition in signup?)
                        setUserRole(ROLES.ANGGOTA);
                        setUserStatus("pending");
                    }
                } catch (error) {
                    console.error("Error fetching role:", error);
                    setUserRole(ROLES.ANGGOTA);
                    setUserStatus("pending");
                }
            } else {
                setUserRole(null);
                setUserStatus(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        hasRole: (role) => userRole === role,
        currentUser,
        userRole,
        userStatus,
        signup,
        login,
        loginWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
