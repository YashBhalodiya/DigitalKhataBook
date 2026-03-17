import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../../firebase";
import { notificationService } from "./notificationService";

export const transactionService = {
  addCreditEntry: async (shopId, customerId, transactionData) => {
    try {
      const { amount, description, date } = transactionData;
      const parsedAmount = parseFloat(amount);

      const transactionRef = await addDoc(collection(db, "transactions"), {
        shopId,
        customerId,
        type: "credit",
        amount: parsedAmount,
        description: description || "Credit Entry",
        date,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const customerRef = doc(db, "customers", customerId);
      await updateDoc(customerRef, {
        totalDue: increment(parsedAmount),
        updatedAt: serverTimestamp(),
      });

      const customerSnap = await getDoc(customerRef);
      const customerData = customerSnap.data();

      if (customerData?.userId) {
        const userSnap = await getDoc(doc(db, "users", customerData.userId));
        const userData = userSnap.data();

        if (userData?.expoPushToken) {
          const shopSnap = await getDoc(doc(db, "shops", shopId));
          const shopName = shopSnap.data()?.shopName || "Your shop";

          await notificationService.sendPushToCustomer(
            userData.expoPushToken,
            shopName,
            parsedAmount,
            description,
          );
        }
      }

      return transactionRef.id;
    } catch (error) {
      throw error;
    }
  },

  addPaymentEntry: async (shopId, customerId, transactionData) => {
    try {
      const { amount, description, date } = transactionData;
      const parsedAmount = parseFloat(amount);

      const transactionRef = await addDoc(collection(db, "transactions"), {
        shopId,
        customerId,
        type: "payment",
        amount: parsedAmount,
        description: description || "Payment Entry",
        date,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const customerRef = doc(db, "customers", customerId);
      await updateDoc(customerRef, {
        totalDue: increment(-parsedAmount),
        updatedAt: serverTimestamp(),
      });

      const customerSnap = await getDoc(customerRef);
      const customerData = customerSnap.data();

      if (customerData?.userId) {
        const userSnap = await getDoc(doc(db, "users", customerData.userId));
        const userData = userSnap.data();

        if (userData?.expoPushToken) {
          const shopSnap = await getDoc(doc(db, "shops", shopId));
          const shopName = shopSnap.data()?.shopName || "Your shop";

          await notificationService.sendPushToCustomer(
            userData.expoPushToken,
            shopName,
            amount + " (Payment Received)",
            description,
          );
        }
      }

      return transactionRef.id;
    } catch (error) {
      throw error;
    }
  },

  getCustomerTransactions: async (customerId) => {
    try {
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("customerId", "==", customerId));
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      return transactions.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || Date.now();
        const timeB = b.createdAt?.toMillis() || Date.now();
        return timeB - timeA;
      });
    } catch (error) {
      throw error;
    }
  },

  deleteTransaction: async (transactionId, customerId, amount, type) => {
    try {
      await deleteDoc(doc(db, "transactions", transactionId));
      
      const customerRef = doc(db, "customers", customerId);
      const adjustment = type === "credit" ? -amount : amount;
      await updateDoc(customerRef, {
        totalDue: increment(adjustment),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  },

  getAllTransactionsForShop: async (shopId) => {
    try {
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("shopId", "==", shopId));
      const querySnapshot = await getDocs(q);
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      return transactions.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || Date.now();
        const timeB = b.createdAt?.toMillis() || Date.now();
        return timeB - timeA;
      });
    } catch (error) {
      throw error;
    }
  }
};
