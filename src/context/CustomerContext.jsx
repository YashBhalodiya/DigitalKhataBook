import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { useAuth } from "./AuthContext";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);

  useEffect(() => {
    console.log("CustomerContext: user =", user?.uid);
    if (!userProfile?.shopId) {
      setCustomers([]);
      setCustomersLoading(false);
      return;
    }
    const q = query(
      collection(db, "customers"),
      where("shopId", "==", userProfile.shopId),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("CustomerContext: Fetched customers =", customerData.length);
      setCustomers(customerData);
      setCustomersLoading(false);
    });
    return unsubscribe;
  }, [userProfile?.shopId]);

  return (
    <CustomerContext.Provider value={{ customers, customersLoading }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => useContext(CustomerContext);
