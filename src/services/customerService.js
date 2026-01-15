import { collection, doc, getDocs, increment, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase";

export const customerService = {
  addCustomer: async (shopId, customerData) => {
    try {
      const customerRef = doc(collection(db, 'customers'));
      const customerId = customerRef.id;

      await setDoc(customerRef,{
        shopId: shopId,
        name: customerData.name,
        phone: customerData.phone,
        totalDue: customerData.totalDue || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      const shopRef = doc(db, 'shops', shopId)
      await updateDoc(shopRef, {
        customerCount: increment(1),
        updatedAt: serverTimestamp()
      })
      return customerId;
    } catch (error) {
      throw error
    }
  },
  getCustomers: async (shopId) => {
    try {
      const customerRef = collection(db, 'customers')
      const q = query(customerRef, where('shopId', '==', shopId))
      const querySnapshot = await getDocs(q)
      const customers = []
      querySnapshot.forEach((doc) => {
        customers.push({id: doc.id, ...doc.data()})
      })
      return customers
    } catch (error) {
      throw error
    }
  },
  getCustomerCount: async (shopId) => {
    try {
      const customerRef = collection(db, 'customers')
      const q = query(customerRef, where('shopId', '==', shopId))
      const querySnapshot = await getDocs(q)
      return querySnapshot.size
    } catch (error) {
      throw error
    }
  }
};