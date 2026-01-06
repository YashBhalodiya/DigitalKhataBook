import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const createUserProfile = async (uid, userData) => {
    await setDoc(doc(db, "users", uid), userData)
}

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};