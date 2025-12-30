import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

// export const signupWithEmail = async (email, password) => {
//     await createUserWithEmailAndPassword(auth, email, password);
// }

// export const loginWithEmail = async (email, password) => {
//     await signInWithEmailAndPassword(auth, email, password);
// }

export const AuthService={
    signup: async (email, password, userData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: email, 
                role: userData.role || "customer",
                createdAt: new Date().toISOString(),
                ...userData
            })

            return userCredential;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    
    login: async (email, password) => {
        try {
            const userCredential = signInWithEmailAndPassword(auth, email, password);
            return userCredential
        } catch (error) {
            throw new Error(error.message);
        }
    },

    signout: async () => {
        try {
            await signOut();
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getUserProfile: async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if(userDoc.exists()){
                return userDoc.data();
            }
            return null;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}