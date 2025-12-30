import { doc, setDoc } from "firebase/firestore"
import { db } from "../../firebase"

export const createUserProfile = async (uid, userData) => {
    await setDoc(doc(db, "users", uid), userData)
}
