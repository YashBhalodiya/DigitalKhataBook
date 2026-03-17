import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { customerService } from "../../src/services/customerService";
import { shopService } from "../../src/services/shopService";

const CustomerDashboard = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchCustomerData();
    }, [userProfile?.id]),
  );

  const fetchCustomerData = async () => {
    if (!userProfile?.id) return;
    try {
      setLoading(true);
      const customerData = await customerService.getCustomerByUserId(userProfile.id);
      setCustomer(customerData);
      
      if (customerData?.shopId) {
        const shopData = await shopService.getShopById(customerData.shopId);
        setShop(shopData);
      }
    } catch (error) {
      console.error("Error fetching customer dashboard data:", error);
    } finally {
      setLoading(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Account</Text>
            <Text style={styles.headerSubtitle}>Customer: {customer?.name || userProfile?.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/(customer)/CustomerProfile")}
          >
            <Ionicons name="person-circle-outline" size={32} color="#059669" />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeLabel}>Welcome back,</Text>
          <Text style={styles.welcomeName}>{customer?.name || userProfile?.name}</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Outstanding Balance</Text>
          <Text style={styles.balanceAmount}>
            ₹{(customer?.totalDue || 0).toLocaleString("en-IN")}
          </Text>
          <View style={styles.balanceInfo}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="rgba(255,255,255,0.9)"
            />
            <Text style={styles.balanceInfoText}>
              Amount to be paid to shop
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(customer)/CustomerTransaction")}
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <Ionicons name="receipt-outline" size={22} color="#059669" />
              </View>
              <Text style={styles.actionText}>View All Transactions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {shop && (
          <View style={styles.shopSection}>
            <Text style={styles.shopLabel}>Shop Details</Text>
            <View style={styles.shopCard}>
              <Ionicons
                name="storefront"
                size={20}
                color="#059669"
                style={styles.shopIcon}
              />
              <View>
                <Text style={styles.shopName}>{shop.shopName || shop.ownerName}</Text>
                <Text style={styles.shopAddress}>{shop.phone && `Ph: ${shop.phone}`}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeCard: {
    backgroundColor: "#E0F2F1",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  welcomeLabel: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  balanceCard: {
    backgroundColor: "#059669",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  balanceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  balanceInfoText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  actionIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  shopSection: {
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  shopLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  shopCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  shopIcon: {
    marginRight: 14,
    backgroundColor: "#F0FDF4",
    padding: 10,
    borderRadius: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  shopAddress: {
    fontSize: 13,
    color: "#6B7280",
  },
});

export default CustomerDashboard;
