import { useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import { AuthService } from "../services/authService";

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
        const profile = await AuthService.getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if(loading) return;
    const inAuthGroup = segments[0] === '(auth)'
    const inShopOwnerGroup = segments[0] === '(shop-owner)';
    const inCustomerGroup = segments[0] === '(customer)';

    console.log('Navigation - User:', user?.email, 'Role:', userProfile?.role, 'InAuth:', inAuthGroup, inShopOwnerGroup, inCustomerGroup); // Debug log

    if(!user && !inAuthGroup){
      router.replace('/(auth)/login')
    }else if (user && userProfile && inAuthGroup) {
      if (userProfile.role === 'shop-owner') {
        router.replace('/(shop-owner)/(tabs)/dashboard')
      }else if (userProfile.role === 'customer') {
        router.replace('/(customer)/dashboard')
      }
    }else if(user && userProfile){
      if(userProfile.role === 'shop-owner' && inCustomerGroup){
        router.replace('/(shop-owner)/(tabs)/dashboard')
      }else if (userProfile.role === 'customer' && inShopOwnerGroup) {
        router.replace('/(customer)/dashboard')
      }
    }
  },[user, userProfile, loading, segments])

  const signInWithEmail = async (email, password) => {
    try {
      const result = await AuthService.login(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, userData) => {
    try {
      const result = await AuthService.signup(email, password, userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signout();
      router.replace('/(auth)/login')
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
