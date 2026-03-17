import { useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { authService } from "../services/authService";
import {notificationService} from '../services/notificationService'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

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
              console.log("Redirecting to verify email");
              router.replace("/(auth)/VerifyEmailScreen");
            } else {
              // Check user role and navigate accordingly
              if (profile.role === "shop-owner") {
                router.replace("/(shop-owner)/Dashboard");
              } else if (profile.role === "customer") {
                // After confirming role === "customer", find their customer record and link it
                const customersQuery = query(
                  collection(db, "customers"),
                  where("phone", "==", profile.phone),
                );
                const snap = await getDocs(customersQuery);
                if (!snap.empty) {
                  await updateDoc(snap.docs[0].ref, {
                    userId: firebaseUser.uid,
                  });
                }
                notificationService.registerPushToken(firebaseUser.uid); // non-blocking
                router.replace("/(customer)/CustomerDashboard");
              } else {
                console.error("Unknown user role:", profile.role);
                await authService.singout();
              }
            }
          }
        } catch (error) {
          throw error;
        }
      } else {
        setUser(null);
        setUserProfile(null);
        const inAuthGroup = segments[0] === "(auth)";
        if (!inAuthGroup) {
          router.replace("/(auth)/LoginScreen");
        }
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

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile({ id: userDoc.id, ...userDoc.data() });
        }
      } catch (error) {
        console.error("Failed to refresh profile:", error);
      }
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
    forgotPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
