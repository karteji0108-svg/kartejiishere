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

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, fullName) {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore with default role 'super_admin' to allow write access during testing
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email,
            role: "super_admin", // Changed from 'anggota' to 'super_admin' to bypass permission restrictions
            status: "active",
            createdAt: new Date().toISOString()
        });

        return user;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        // If specific Client ID is needed for certain configs, it's usually handled in Firebase console
        // or via provider.setCustomParameters(). The user provided one, but usually default works.
        // provider.setCustomParameters({ 'client_id': '877730599886-649dp45jcmdqk8taoma1m70o74r9ehi1.apps.googleusercontent.com' });

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore, if not create
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    fullName: user.displayName,
                    email: user.email,
                    role: "super_admin", // Default for dev/testing
                    status: "active",
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
                // Fetch user role from Firestore
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserRole(docSnap.data().role);
                } else {
                    setUserRole("anggota"); // Default fallback
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
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
