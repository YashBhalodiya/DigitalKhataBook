import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export const signupWithEmail = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
}

export const loginWithEmail = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
}