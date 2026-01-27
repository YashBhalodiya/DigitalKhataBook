import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const profile = { id: userDoc.id, ...userDoc.data() };

            if (firebaseUser.emailVerified && !profile.emailVerified) {
              await updateDoc(doc(db, "users", firebaseUser.uid), {
                emailVerified: true,
              });
              profile.emailVerified = true;
            }

            setUserProfile(profile);

            if (!firebaseUser.emailVerified) {
              router.replace("/(auth)/VerifyEmailScreen");
            } else if (profile.role === "shop-owner") {
              router.replace("/(shop-owner)/Dashboard");
            } else if (profile.role === "customer") {
              router.replace("/(customer)/CustomerDashboard");
            }
          }
        } catch (error) {
          throw error;
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUpShopOwner = async (userData) => {
    return await authService.signUpShopOwner(userData);
  };

  const signUpCustomer = async (userData) => {
    return await authService.signUpCustomer(userData);
  };

  const signInWithEmail = async (email, password) => {
    try {
      return await authService.signIn(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.singout();
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (user) {
        await authService.resendVerificationEmail(user);
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signInWithEmail,
    signUpCustomer,
    signUpShopOwner,
    signOut,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
