import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { customerService } from "../../src/services/customerService";
import { transactionService } from "../../src/services/transactionService";

const CustomerDetail = () => {
  const router = useRouter();
  const { customerId } = useLocalSearchParams();
  const { userProfile } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ credit: 0, payment: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    if (!customerId && !userProfile?.shopId) {
      ToastAndroid.show("Customer not found", ToastAndroid.SHORT);
      return;
    }
    try {
      setLoading(true);
      const customerData = await customerService.getCustomerById(customerId);
      setCustomer(customerData);

      const txs = await transactionService.getCustomerTransactions(customerId);
      setTransactions(txs);

      let totalCredit = 0;
      let totalPayment = 0;
      txs.forEach((t) => {
        if (t.type === "credit") totalCredit += t.amount;
        if (t.type === "payment") totalPayment += t.amount;
      });
      setStats({ credit: totalCredit, payment: totalPayment, count: txs.length });
    } catch (error) {
      ToastAndroid.show("Error fetching details", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredit = () => {
    router.push({
      pathname: "(shop-owner)/AddCreditEntry",
      params: { preSelectedCustomerId: customerId },
    });
  };

  const handleAddPayment = () => {
    router.push({
      pathname: "(shop-owner)/AddPaymentEntry",
      params: { preSelectedCustomerId: customerId },
    });
  };

  const handleEditCustomer = () => {
    ToastAndroid.show("Edit customer feature coming soon", ToastAndroid.SHORT);
  };

  const handleDeleteCustomer = () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await customerService.deleteCustomer(customerId, userProfile.shopId);
              ToastAndroid.show("Customer deleted", ToastAndroid.SHORT);
              router.back();
            } catch (error) {
              ToastAndroid.show("Failed to delete customer", ToastAndroid.SHORT);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Details</Text>
        <TouchableOpacity onPress={handleEditCustomer} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="#059669" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Customer Info Card */}
        <View style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer?.name}</Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.customerPhone}>{customer?.phone}</Text>
              </View>
            </View>
          </View>

          {/* Outstanding Amount */}
          <View style={styles.dueContainer}>
            <Text style={styles.dueLabel}>Total Outstanding</Text>
            <Text style={styles.dueAmount}>₹ {customer?.totalDue || 0}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.creditButton]}
              onPress={handleAddCredit}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Add Credit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.paymentButton]}
              onPress={handleAddPayment}
            >
              <Ionicons name="wallet-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Add Payment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            {transactions.length > 5 && (
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx) => (
              <View key={tx.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View
                    style={[
                      styles.transactionIcon,
                      tx.type === "credit" ? styles.creditIcon : styles.paymentIcon,
                    ]}
                  >
                    <Ionicons
                      name={tx.type === "credit" ? "arrow-up-outline" : "arrow-down-outline"}
                      size={20}
                      color={tx.type === "credit" ? "#dc2626" : "#059669"}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionType}>
                      {tx.type === "credit" ? "Credit" : "Payment"}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {tx.createdAt
                        ? new Date(tx.createdAt.toMillis()).toLocaleDateString()
                        : "Just now"}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      tx.type === "payment" && styles.paymentAmount,
                    ]}
                  >
                    {tx.type === "credit" ? "+ " : "- "}₹ {tx.amount}
                  </Text>
                </View>
                {tx.description ? (
                  <Text style={styles.transactionDescription}>{tx.description}</Text>
                ) : null}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubText}>
                Add credit or payment entries to see transaction history
              </Text>
            </View>
          )}
        </View>

        {/* Customer Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="arrow-up-circle-outline" size={24} color="#dc2626" />
              <Text style={styles.statValue}>₹ {stats.credit}</Text>
              <Text style={styles.statLabel}>Total Credit</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="arrow-down-circle-outline" size={24} color="#059669" />
              <Text style={styles.statValue}>₹ {stats.payment}</Text>
              <Text style={styles.statLabel}>Total Payment</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="receipt-outline" size={24} color="#0891b2" />
              <Text style={styles.statValue}>{stats.count}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCustomer}>
            <Ionicons name="trash-outline" size={20} color="#dc2626" />
            <Text style={styles.deleteButtonText}>Delete Customer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  editButton: {
    padding: 4,
  },
  customerCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  customerPhone: {
    fontSize: 14,
    color: "#666",
  },
  dueContainer: {
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  dueLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  dueAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#059669",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  creditButton: {
    backgroundColor: "#059669",
  },
  paymentButton: {
    backgroundColor: "#0891b2",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  creditIcon: {
    backgroundColor: "#FEE2E2",
  },
  paymentIcon: {
    backgroundColor: "#D1FAE5",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dc2626",
  },
  paymentAmount: {
    color: "#059669",
  },
  transactionDescription: {
    fontSize: 14,
    color: "#666",
    marginLeft: 52,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  deleteButtonText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomerDetail;
