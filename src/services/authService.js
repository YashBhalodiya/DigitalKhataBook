import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { shopService } from '../services/shopService';

export const authService = {
  signUpShopOwner: async (userData) => {
    try {
        const {name, email, password, phone, shopName} = userData;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid
        
        const shopId = await shopService.createShop(userId, {
          shopName,
          name,
          phone
        })
        
        await setDoc(doc(db, 'users', userId), {
          name,
          email,
          phone,
          role: 'shop-owner',
          shopId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })


        return {userId, shopId}
    } catch (error) {
        throw error
    }
  },
  signUpCustomer: async (userData) => {
    try {
      const {name, email, password, phone} = userData;
      const userCredential = await createUserWithEmailAndPassword(auth, email,password)
      const userId = userCredential.user.uid

      await setDoc(doc(db, 'users', userId), {
        name,
        email,
        phone,
        role: 'customer',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return {userId}
    } catch (error) {
      throw error
    }
  },
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userId = userCredential.user.uid

      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        return {userId, ...userDoc.data()}
      }
    } catch (error) {
      throw error
    }
  },
  singout: async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw error
    }
  }
}