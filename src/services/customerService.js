import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export const customerService = {
  addCustomer: async (shopId, customerData) => {
    try {
      const customerRef = doc(collection(db, "customers"));
      const customerId = customerRef.id;

      await setDoc(customerRef, {
        shopId: shopId,
        name: customerData.name,
        phone: customerData.phone,
        totalDue: customerData.totalDue || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const shopRef = doc(db, "shops", shopId);
      await updateDoc(shopRef, {
        customerCount: increment(1),
        updatedAt: serverTimestamp(),
      });
      return customerId;
    } catch (error) {
      throw error;
    }
  },
  updateCustomer: async (customerId, customerData) => {
    try {
      const customerRef = doc(db, "customers", customerId);
      await updateDoc(customerRef, {
        name: customerData.name,
        phone: customerData.phone,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  },
  deleteCustomer: async (customerId, shopId) => {
    try {
      const customerRef = doc(db, "customers", customerId);
      await deleteDoc(customerRef);

      const shopRef = doc(db, "shops", shopId);
      await updateDoc(shopRef, {
        customerCount: increment(-1),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  },
  getCustomers: async (shopId) => {
    try {
      const customerRef = collection(db, "customers");
      const q = query(customerRef, where("shopId", "==", shopId));
      const querySnapshot = await getDocs(q);
      const customers = [];
      querySnapshot.forEach((doc) => {
        customers.push({ id: doc.id, ...doc.data() });
      });
      return customers;
    } catch (error) {
      throw error;
    }
  },
  getCustomerById: async (customerId) => {
    try {
      const customerRef = doc(db, "customers", customerId);
      const customerDoc = await getDoc(customerRef);
      if (customerDoc.exists()) {
        return {
          id: customerDoc.id,
          ...customerDoc.data(),
        };
      } else {
        throw new Error("Customer not found");
      }
    } catch (error) {
      throw error;
    }
  },
  getCustomerCount: async (shopId) => {
    try {
      const customerRef = collection(db, "customers");
      const q = query(customerRef, where("shopId", "==", shopId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      throw error;
    }
  },
  getTotalOutstanding: async (shopId) => {
    try {
      const customerRef = collection(db, "customers");
      const q = query(customerRef, where("shopId", "==", shopId));
      const querySnapshot = await getDocs(q);

      let totalOutstanding = 0;
      querySnapshot.forEach((doc) => {
        const customerData = doc.data();
        totalOutstanding += customerData.totalDue || 0;
      });
      return totalOutstanding;
    } catch (error) {
      throw error;
    }
  },
  getShopStats: async (shopId) => {
    try {
      const customerRef = collection(db, "customers");
      const q = query(customerRef, where("shopId", "==", shopId));
      const querySnapshot = await getDocs(q);

      let totalOutstanding = 0;
      let customerCount = 0;
      querySnapshot.forEach((doc) => {
        const customerData = doc.data();
        totalOutstanding += customerData.totalDue || 0;
        customerCount++;
      });
      return {
        totalOutstanding,
        customerCount,
      };
    } catch (error) {
      throw error;
    }
  },
  getTopCustomers: async (shopId) => {
    try {
      const q = query(
        collection(db, "customers"),
        where("shopId", "==", shopId),
      );
      const snapshot = await getDocs(q);
      const customers = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.totalDue > 0) {
          customers.push({
            id: doc.id,
            name: data.name,
            totalDue: data.totalDue,
          });
        }
      });
      // Return top 5 sorted by highest due
      return customers.sort((a, b) => b.totalDue - a.totalDue).slice(0, 5);
    } catch (error) {
      throw error;
    }
  },
  getCustomerByUserId: async (userId) => {
    try {
      const q = query(collection(db, "customers"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
};
