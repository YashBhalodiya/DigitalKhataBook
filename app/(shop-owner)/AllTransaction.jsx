import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { transactionService } from '../../src/services/transactionService';
import { customerService } from '../../src/services/customerService';

const AllTransaction = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOutstanding: 0 });

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [userProfile?.shopId])
  );

  const fetchTransactions = async () => {
    if (!userProfile?.shopId) return;
    try {
      setLoading(true);
      const shopStats = await customerService.getShopStats(userProfile.shopId);
      setStats(shopStats);

      const custList = await customerService.getCustomers(userProfile.shopId);
      const custDict = {};
      custList.forEach(c => custDict[c.id] = c);
      setCustomers(custDict);

      const txs = await transactionService.getAllTransactionsForShop(userProfile.shopId);
      setTransactions(txs);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTransaction = ({ item }) => {
    const isCredit = item.type === 'credit';
    const customer = customers[item.customerId];

    return (
      <View style={styles.transactionCard}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isCredit ? '#fee2e2' : '#dcfce7',
            },
          ]}
        >
          <Ionicons
            name={isCredit ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={isCredit ? '#dc2626' : '#16a34a'}
          />
        </View>

        <View style={styles.transactionContent}>
          <Text style={styles.transactionType}>{isCredit ? 'Credit' : 'Payment'}</Text>
          <Text style={styles.transactionDate}>
            {item.createdAt ? new Date(item.createdAt.toMillis()).toLocaleString() : 'Just now'}
          </Text>
          <Text style={styles.transactionDescription}>
             {customer?.name || "Unknown"} {item.description ? ` - ${item.description}` : ''}
          </Text>
        </View>

        <Text
          style={[
            styles.transactionAmount,
            {
              color: isCredit ? '#dc2626' : '#16a34a',
            },
          ]}
        >
          {isCredit ? '+' : '-'}₹{Math.abs(item.amount).toLocaleString('en-IN')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>All Transactions</Text>
          <Text style={styles.headerSubtitle}>Shop: {userProfile?.name}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          }
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Total Outstanding</Text>
        <Text style={styles.footerAmount}>₹{(stats.totalOutstanding || 0).toLocaleString('en-IN')}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6366f1',
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#6366f1',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
});

export default AllTransaction;
