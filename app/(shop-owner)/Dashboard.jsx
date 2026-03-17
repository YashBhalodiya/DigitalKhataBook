import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { customerService } from "../../src/services/customerService";
import { notificationService } from "../../src/services/notificationService";

const Dashboard = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [shopStats, setShopStats] = useState({
    totalOutstanding: 0,
    customerCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [topCustomers, setTopCustomers] = useState([]);

  const fetchShopStats = async () => {
    if (!userProfile?.shopId) {
      return;
    }
    try {
      setLoading(true);
      const stats = await customerService.getShopStats(userProfile.shopId);
      setShopStats(stats);
      const customers = await customerService.getTopCustomers(
        userProfile.shopId,
      );
      setTopCustomers(customers);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchShopStats();
      scheduleHighOutstandingReminder();
    }, [userProfile?.shopId]),
  );

  useEffect(() => {
    // Initialize notifications on app start
    notificationService.initialize();
  }, []);

  const sendPaymentReminder = async (customer) => {
    try {
      await notificationService.sendInstantNotification(
        "Payment Reminder Sent",
        `Reminder sent to ${customer.name} for ₹${customer.outstanding}`,
        { customerId: customer.id },
      );
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  };

  // Schedule reminder for high outstanding customers
  const scheduleHighOutstandingReminder = async () => {
    if (shopStats.totalOutstanding > 10000) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0);

      await notificationService.schedulePaymentReminder(
        "All Customers",
        shopStats.totalOutstanding,
        tomorrow,
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </SafeAreaView>
    );
  }

  const addCustomer = () => {
    router.push("/(shop-owner)/AddCustomerModal");
  };

  const viewAllCustomer = () => {
    router.push("/(shop-owner)/ListAllCustomers");
  };

  const addCreditEntry = () => {
    router.push("/(shop-owner)/AddCreditEntry");
    console.log("Pressed");
  };

  const monthlySummary = () => {
    router.push("/(shop-owner)/MonthlySummary");
    console.log("Pressed");
  };

  const allTransaction = () => {
    router.push("/(shop-owner)/AllTransaction");
    console.log("Pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Shop Owner: {userProfile?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(shop-owner)/ShopOwnerProfile")}
          >
            <Ionicons name="person-circle" size={40} color="#059669" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.outstandingCard]}>
            <Text style={[styles.statLabel, styles.whiteText]}>
              Total Outstanding
            </Text>
            <Text style={[styles.statValue, styles.whiteText]}>
              ₹ {shopStats?.totalOutstanding || 0}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Number of Customers</Text>
            <Text style={styles.statValue}>{shopStats.customerCount}</Text>
          </View>
        </View>

        {topCustomers.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              Top Customers by Outstanding (₹)
            </Text>
            <BarChart
              data={topCustomers.map((c) => ({
                value: c.totalDue,
                label: c.name.split(" ")[0],
                frontColor: "#059669",
              }))}
              barWidth={40}
              spacing={18}
              roundedTop
              xAxisThickness={1}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "#6b7280", fontSize: 10 }}
              xAxisLabelTextStyle={{ color: "#6b7280", fontSize: 10 }}
              noOfSections={4}
              height={160}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionCard} onPress={addCustomer}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="person-add-outline"
                  size={28}
                  color="#05865dff"
                />
              </View>
              <Text style={styles.actionCardText}>Add Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={addCreditEntry}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="add" size={28} color="#05865dff" />
              </View>
              <Text style={styles.actionCardText}>Add Credit Entry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={monthlySummary}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="stats-chart-outline"
                  size={28}
                  color="#05865dff"
                />
              </View>
              <Text style={styles.actionCardText}>Monthly Summary</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.viewSection}>
          <Text style={styles.sectionTitle}>Manage</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={viewAllCustomer}
          >
            <Ionicons
              name="people-outline"
              size={24}
              color="#05865dff"
              style={{
                backgroundColor: "#eff8f5ff",
                padding: 5,
                borderRadius: 5,
              }}
            />
            <Text style={styles.actionButtonText}>View All Customers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={allTransaction}
          >
            <Ionicons
              name="clipboard-outline"
              size={24}
              color="#05865dff"
              style={{
                backgroundColor: "#eff8f5ff",
                padding: 5,
                borderRadius: 5,
              }}
            />
            <Text style={styles.actionButtonText}>All Transactions</Text>
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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    // borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#E8F5E9',
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 4,
  },
  outstandingCard: {
    backgroundColor: "#05865dff",
  },
  whiteText: {
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 12,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#e0e0e0",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    minHeight: 100,
    justifyContent: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#eff8f5ff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionCardText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginTop: 4,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#dbdbdbff",
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  actionButtonText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
});

export default Dashboard;
