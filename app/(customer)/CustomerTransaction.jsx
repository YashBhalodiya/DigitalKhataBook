import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomerTransaction = () => {
  const router = useRouter();

  // Sample transaction data
  const transactions = [
    {
      id: 1,
      type: 'purchase',
      title: 'Purchase',
      date: 'Jan 7, 2026',
      description: 'Groceries purchase',
      amount: 850,
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment',
      date: 'Jan 5, 2026',
      description: 'Cash payment',
      amount: 1000,
    },
    {
      id: 3,
      type: 'purchase',
      title: 'Purchase',
      date: 'Jan 3, 2026',
      description: 'Monthly supplies',
      amount: 1200,
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment',
      date: 'Dec 30, 2025',
      description: 'Partial payment',
      amount: 500,
    },
    {
      id: 5,
      type: 'purchase',
      title: 'Purchase',
      date: 'Dec 28, 2025',
      description: 'Bulk order',
      amount: 1500,
    },
    {
      id: 6,
      type: 'payment',
      title: 'Payment',
      date: 'Dec 25, 2025',
      description: 'Full settlement',
      amount: 2000,
    },
  ];

  const currentBalance = 3250;
  const shopName = 'Kumar General Store';

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
          <Text style={styles.headerSubtitle}>{shopName}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction List */}
        <View style={styles.transactionList}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIconContainer,
                  transaction.type === 'purchase' ? styles.purchaseIconBg : styles.paymentIconBg
                ]}>
                  <Ionicons 
                    name={transaction.type === 'purchase' ? 'arrow-up' : 'arrow-down'} 
                    size={20} 
                    color={transaction.type === 'purchase' ? '#DC2626' : '#059669'} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'purchase' ? styles.purchaseAmount : styles.paymentAmount
              ]}>
                {transaction.type === 'purchase' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>₹{currentBalance.toLocaleString('en-IN')}</Text>
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
