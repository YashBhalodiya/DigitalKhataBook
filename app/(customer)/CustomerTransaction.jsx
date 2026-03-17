import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../../src/context/AuthContext";
import { customerService } from "../../src/services/customerService";
import { transactionService } from "../../src/services/transactionService";
import { shopService } from "../../src/services/shopService";

const CustomerTransaction = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [shop, setShop] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchTransactionData();
    }, [userProfile?.id])
  );

  const fetchTransactionData = async () => {
    if (!userProfile?.id) return;
    try {
      setLoading(true);
      const customerData = await customerService.getCustomerByUserId(userProfile.id);
      setCustomer(customerData);
      
      if (customerData?.shopId) {
        const shopData = await shopService.getShopById(customerData.shopId);
        setShop(shopData);
      }

      if (customerData?.id) {
        const txs = await transactionService.getCustomerTransactions(customerData.id);
        setTransactions(txs);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Transactions</Text>
          <Text style={styles.headerSubtitle}>{shop?.shopName || shop?.ownerName || "Your Shop"}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction List */}
        <View style={styles.transactionList}>
          {transactions.length > 0 ? transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIconContainer,
                  transaction.type === 'credit' ? styles.purchaseIconBg : styles.paymentIconBg
                ]}>
                  <Ionicons 
                    name={transaction.type === 'credit' ? 'arrow-up' : 'arrow-down'} 
                    size={20} 
                    color={transaction.type === 'credit' ? '#DC2626' : '#059669'} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{transaction.type === 'credit' ? 'Credit taken' : 'Payment made'}</Text>
                  <Text style={styles.transactionDate}>
                    {transaction.createdAt ? new Date(transaction.createdAt.toMillis()).toLocaleDateString() : 'Just now'}
                  </Text>
                  {transaction.description ? <Text style={styles.transactionDescription}>{transaction.description}</Text> : null}
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'credit' ? styles.purchaseAmount : styles.paymentAmount
              ]}>
                {transaction.type === 'credit' ? '+' : '-'}₹{(transaction.amount || 0).toLocaleString('en-IN')}
              </Text>
            </View>
          )) : (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text style={{ marginTop: 10, color: '#666', fontSize: 16 }}>No transactions found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Outstanding Balance</Text>
          <Text style={styles.balanceAmount}>₹{(customer?.totalDue || 0).toLocaleString('en-IN')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  transactionList: {
    padding: 16,
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  purchaseIconBg: {
    backgroundColor: '#FEF2F2',
  },
  paymentIconBg: {
    backgroundColor: '#F0FDF4',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  purchaseAmount: {
    color: '#DC2626',
  },
  paymentAmount: {
    color: '#059669',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  }
});

export default CustomerTransaction;
